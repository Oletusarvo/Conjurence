import { tablenames } from '@/tablenames';
import { DBContext } from '@/util/db-context';
import { TEventData } from '../schemas/event-schema';
import { Knex } from 'knex';
import { Repository } from '@/util/repository';

export class EventRepository extends Repository {
  private getBaseQuery(ctx: DBContext) {
    //Get the event instance.
    const eventInstanceSubquery = ctx
      .select('*', 'id as ei_id')
      .from(tablenames.event_instance)
      .as('ei');

    //Get the host participant.
    const hostParticipantSubquery = ctx
      .select('user_id as host_user_id', 'event_instance_id')
      .from(tablenames.event_attendance)
      .whereIn(
        'attendance_status_id',
        ctx(tablenames.event_attendance_status).whereIn('label', ['host']).select('id as status_id')
      )
      .as('hp');

    //Get the host username.
    const hostUsernameSubquery = ctx(tablenames.user)
      .select('id as host_user_id', 'username as host')
      .as('u');

    //Get the thresholds.
    const thresholdsQuery = ctx(tablenames.event_threshold)
      .select('auto_join_threshold', 'auto_leave_threshold', 'id as threshold_id')
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

    const q = ctx(ctx.select('*', 'id AS e_id').from(tablenames.event_data).as('e'))
      .join(eventInstanceSubquery, 'ei.event_data_id', 'e.e_id')
      .join(hostParticipantSubquery, 'hp.event_instance_id', 'ei.id')
      .join(hostUsernameSubquery, 'u.host_user_id', 'hp.host_user_id')
      .leftJoin(participantCountSubquery, 'ap.ap_instance_id', 'ei.id')
      .leftJoin(attendantCountSubquery, 'ac.ac_instance_id', 'ei.id')
      .leftJoin(thresholdsQuery, 'event_threshold.threshold_id', 'ei.event_threshold_id')
      .join(eventCategorySubquery, 'ec.category_id', 'e.event_category_id')
      .select(
        'e.title',
        'e.description',
        'ei.id as id',
        'ec.label as category',
        'ei.created_at',
        'ei.ended_at',
        'e.spots_available',
        'u.host',
        'ei.position',
        'ei.position_metadata',
        'event_threshold.auto_join_threshold',
        'event_threshold.auto_leave_threshold',
        'ei.location_title',
        'ei.is_mobile',
        ctx.raw('COALESCE(CAST(ap.interested_count AS INTEGER), 0) AS interested_count'),
        ctx.raw('COALESCE(CAST(ac.attendance_count AS INTEGER), 0) AS attendance_count'),
        ctx.raw('ST_AsGeoJSON(position)::json AS position')
      );

    return q;
  }

  /**Returns the data of an event instance. */
  async getDataByInstanceId(instance_id: string, ctx: DBContext): Promise<TEventData> {
    return await ctx(tablenames.event_data)
      .join(
        ctx
          .select('event_data_id', 'id as instance_id_actual')
          .from(tablenames.event_instance)
          .groupBy('instance_id_actual')
          .as('instance'),
        'instance.event_data_id',
        'event_data.id'
      )
      .where({
        'instance.instance_id_actual': instance_id,
      })
      .select('event_data.*')
      .first();
  }

  /**Returns the username and id of the user hosting an event. */
  async getHostByEventId(
    event_id: string,
    ctx: DBContext
  ): Promise<{ username: string; id: string }> {
    return await ctx({ instance: tablenames.event_instance })
      .join(
        ctx
          .select('author_id', 'id as data_id_actual')
          .from(tablenames.event_data)
          .as('event_data'),
        'event_data.data_id_actual',
        'instance.event_data_id'
      )
      .join(
        ctx.select('id as user_id_actual', 'username').from(tablenames.user).as('user'),
        'user.user_id_actual',
        'event_data.author_id'
      )
      .where({ 'instance.id': event_id })
      .select('user.username', 'user.user_id_actual as id')
      .first();
  }

  /**Finds an event by id. */
  async findById(id: string, ctx: DBContext) {
    return await this.getBaseQuery(ctx).where({ 'ei.id': id }).first();
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
    const base = this.getBaseQuery(ctx);
    Repository.withSearch(base, search, ['title', 'description']);
    base
      .whereRaw(
        `ST_DWithin(
  ei.position,
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
  async countInterestedByInstanceId(event_instance_id: string, ctx: DBContext) {
    const result = await ctx(tablenames.event_attendance)
      .where({ event_instance_id })
      .andWhereNot(
        'attendance_status_id',
        ctx.select('id').from(tablenames.event_attendance_status).where({ label: 'host' }).limit(1)
      )
      .count('* as count')
      .first();
    return typeof result.count === 'string' ? parseInt(result.count) : result.count;
  }

  /**Updates an event instance. */
  async updateInstanceById(instance_id: string, payload: any, ctx: DBContext) {
    await ctx(tablenames.event_instance).where({ id: instance_id }).update(payload);
  }

  /**Updates an event's data. */
  async updateDataById(data_id: string, payload: any, ctx: DBContext) {
    await ctx(tablenames.event_data).where({ id: data_id }).update(payload);
  }

  /**Updates the data of an event instance. */
  async updateDataByInstanceId(instance_id: string, payload: any, ctx: DBContext) {
    await ctx(tablenames.event_data)
      .where({
        id: ctx
          .select('event_data_id')
          .from(tablenames.event_instance)
          .where({ id: instance_id })
          .limit(1),
      })
      .update(payload);
  }
}
