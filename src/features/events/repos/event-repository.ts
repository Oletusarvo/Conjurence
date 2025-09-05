import { tablenames } from '@/tablenames';
import { DBContext } from '@/util/db-context';
import { Knex } from 'knex';
import { Repository } from '@/util/repository';
import z from 'zod';
import { createEventSchema, updateEventSchema } from '../schemas/event-schema';
import { createGeographyRow } from '@/features/geolocation/util/create-geography-row';

export class EventRepository extends Repository {
  public getBaseQuery(ctx: DBContext) {
    //Get the host participant.
    const hostParticipantSubquery = ctx
      .select('user_id as host_user_id', 'event_instance_id')
      .from(tablenames.event_attendance)
      .whereIn(
        'attendance_status_id',
        ctx(tablenames.event_attendance_status).whereIn('label', ['host']).select('id as status_id')
      )
      .groupBy('event_instance_id', 'user_id')
      .as('hp');

    //Get the host username.
    const hostUsernameSubquery = ctx(tablenames.user)
      .select('id as host_user_id', 'username as host')
      .as('u');

    //Get the event size settings.
    const thresholdsQuery = ctx(tablenames.event_threshold)
      .select('auto_join_threshold', 'auto_leave_threshold', 'id as threshold_id', 'label as size')
      .groupBy('id')
      .as('event_threshold');

    //Get interested users count.
    const participantCountSubquery = ctx
      .select('event_instance_id AS ap_instance_id')
      .count('* AS interested_count')
      .from(tablenames.event_attendance)
      .whereIn(
        'attendance_status_id',
        ctx
          .select('id AS ap_status_id')
          .from(tablenames.event_attendance_status)
          .whereIn('label', ['interested', 'joined', 'left'])
      )
      .groupBy('event_instance_id')
      .as('ap');

    //Get attendant count
    const attendantCountSubquery = ctx
      .select('event_instance_id as ac_instance_id')
      .count('* AS attendance_count')
      .from(tablenames.event_attendance)
      .whereIn(
        'attendance_status_id',
        ctx
          .select('id')
          .from(tablenames.event_attendance_status)
          .whereIn('label', ['joined', 'host'])
      )
      .groupBy('event_instance_id')
      .as('ac');

    //Get the event category label.
    const eventCategorySubquery = ctx
      .select('id as category_id', 'label')
      .from(tablenames.event_category)
      .as('ec');

    const positionSubquery = ctx
      .select('event_id', 'accuracy', 'coordinates', 'timestamp')
      .from(tablenames.event_position)
      .groupBy('event_id')
      .as('position');

    const q = ctx({ event: tablenames.event_instance })
      .join(positionSubquery, 'position.event_id', 'event.id')
      .join(hostParticipantSubquery, 'hp.event_instance_id', 'event.id')
      .join(hostUsernameSubquery, 'u.host_user_id', 'hp.host_user_id')
      .leftJoin(participantCountSubquery, 'ap.ap_instance_id', 'event.id')
      .leftJoin(attendantCountSubquery, 'ac.ac_instance_id', 'event.id')
      .leftJoin(thresholdsQuery, 'event_threshold.threshold_id', 'event.event_threshold_id')
      .join(eventCategorySubquery, 'ec.category_id', 'event.event_category_id')
      .select(
        'event.author_id',
        'event.title',
        'event.description',
        'event.id as id',
        'ec.label as category',
        'event.created_at',
        'event.ended_at',
        'event.spots_available',
        'u.host',
        'event_threshold.auto_join_threshold',
        'event_threshold.auto_leave_threshold',
        'event_threshold.size',
        'event.is_mobile',
        ctx.raw(
          "JSON_BUILD_OBJECT('coordinates', ST_AsGeoJSON(position.coordinates)::json -> 'coordinates', 'accuracy', position.accuracy, 'timestamp', position.timestamp) AS position"
        ),
        ctx.raw('COALESCE(CAST(ap.interested_count AS INTEGER), 0) AS interested_count'),
        ctx.raw('COALESCE(CAST(ac.attendance_count AS INTEGER), 0) AS attendance_count')
      );

    return q;
  }

  /**Returns the username and id of the user hosting an event. */
  async getHostByEventId(
    event_id: string,
    ctx: DBContext
  ): Promise<{ username: string; id: string }> {
    return await ctx({ event: tablenames.event_instance })
      .join(
        ctx.select('id', 'username').from(tablenames.user).groupBy('id').as('user'),
        'user.id',
        'event.author_id'
      )
      .where({ 'event.id': event_id })
      .select('user.id', 'user.username as username')
      .first();
  }

  /**Returns previously created events of a user with distinct titles and descriptions. */
  async findTemplatesByAuthorId(author_id: string, search: string | null, ctx: DBContext) {
    return await Repository.withSearch(this.getBaseQuery(ctx), search, ['title', 'description'])
      .where({ author_id })
      .distinctOn('event.title', 'event.description');
  }

  /**Finds an event by id. */
  async findById(id: string, ctx: DBContext) {
    return await this.getBaseQuery(ctx).where({ 'event.id': id }).first();
  }

  /**Finds all events hosted by a user. */
  async findByHostId(host_id: string, ctx: DBContext) {
    return await this.getBaseQuery(ctx).where({ host_user_id: host_id });
  }

  /**Finds all events a user has attended. */
  async findAttendedByUserId(user_id: string, ctx: DBContext) {
    return await this.getBaseQuery(ctx)
      .whereIn(
        'attendance_status_id',
        ctx
          .select('id')
          .from(tablenames.event_attendance_status)
          .whereIn('label', ['joined', 'left', 'host'])
      )
      .andWhere({
        user_id,
      });
  }

  /**Returns all events within the specified distance to the provided coordinates. */
  async findWithinDistanceByCoordinates(
    longitude: number,
    latitude: number,
    distance: number,
    ctx: DBContext,
    search: string = null
  ) {
    const base = Repository.withSearch(this.getBaseQuery(ctx), search, ['title', 'description']);
    base
      .whereRaw(
        `ST_DWithin(
  position.coordinates,
  ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography,
  ?  -- distance in meters
)
`,
        [longitude, latitude, distance]
      )
      .where({ ended_at: null });

    return await base;
  }

  /**Returns the number of users who are interested in an event. Excludes the host. */
  async countInterestedById(event_id: string, ctx: DBContext) {
    const result = await ctx(tablenames.event_attendance)
      .where({ event_instance_id: event_id })
      .andWhereNot(
        'attendance_status_id',
        ctx.select('id').from(tablenames.event_attendance_status).where({ label: 'host' }).limit(1)
      )
      .count('* as count')
      .first();
    return typeof result.count === 'string' ? parseInt(result.count) : result.count;
  }

  /**Updates an event instance. */
  async updateById(
    event_id: string,
    payload: Omit<z.infer<typeof updateEventSchema>, 'id'>,
    ctx: DBContext
  ) {
    await ctx(tablenames.event_instance).where({ id: event_id }).update(payload);
    return await this.getBaseQuery(ctx).where({ id: event_id }).first();
  }

  async create(
    payload: z.infer<typeof createEventSchema> & { author_id: string },
    ctx: Knex.Transaction
  ) {
    const { position, ...data } = payload;
    const [newEventRecord] = await ctx(tablenames.event_instance).insert(
      {
        title: data.title,
        description: data.description,
        spots_available: data.spots_available,
        is_mobile: data.is_mobile,
        event_threshold_id: ctx
          .select('id')
          .from(tablenames.event_threshold)
          .where({ label: data.size })
          .limit(1),
        event_category_id: ctx
          .select('id')
          .from(tablenames.event_category)
          .where({ label: data.category })
          .limit(1),
        author_id: data.author_id,
      },
      ['id']
    );

    await ctx(tablenames.event_position).insert({
      event_id: newEventRecord.id,
      coordinates: createGeographyRow(position.coordinates),
      timestamp: position.timestamp,
      accuracy: position.accuracy,
    });

    return newEventRecord;
  }
}

export class TestEventRepository extends EventRepository {
  public getBaseQuery(ctx: DBContext) {
    return super.getBaseQuery(ctx);
  }
}
