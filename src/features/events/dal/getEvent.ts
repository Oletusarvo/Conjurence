import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import { Knex } from 'knex';

//Get the event instance.
const eventInstanceSubquery = db
  .select('*', 'id as ei_id')
  .from(tablenames.event_instance)
  .as('ei');

//Get the host participant.
const hostParticipantSubquery = db
  .select('user_id as host_user_id', 'event_instance_id')
  .from(tablenames.event_attendance)
  .whereIn(
    'attendance_status_id',
    db(tablenames.event_attendance_status).whereIn('label', ['host']).select('id as status_id')
  )
  .as('hp');

//Get the host username.
const hostUsernameSubquery = db(tablenames.user)
  .select('id as host_user_id', 'username as host')
  .as('u');

//Get interested users count.
const participantCountSubquery = db
  .select('event_instance_id AS ap_instance_id')
  .count('* AS interested_count')
  .from(tablenames.event_attendance)
  .whereIn(
    'attendance_status_id',
    db
      .select('id AS ap_status_id')
      .from(tablenames.event_attendance_status)
      .whereIn('label', ['interested', 'joined'])
  )
  .groupBy('event_instance_id')
  .as('ap');

//Get attendant count
const attendantCountSubquery = db
  .select('event_instance_id as ac_instance_id')
  .count('* AS attendance_count')
  .from(tablenames.event_attendance)
  .whereIn(
    'attendance_status_id',
    db.select('id').from(tablenames.event_attendance_status).whereIn('label', ['joined', 'host'])
  )
  .groupBy('event_instance_id')
  .as('ac');

//Get the event category label.
const eventCategorySubquery = db
  .select('id as category_id', 'label')
  .from(tablenames.event_category)
  .as('ec');

const getEventQuery = (ctx: Knex | Knex.Transaction, includeParticipants?: boolean) => {
  const q = ctx(ctx.select('*', 'id AS e_id').from(tablenames.event_data).as('e'))
    .join(eventInstanceSubquery, 'ei.event_data_id', 'e.e_id')
    .join(hostParticipantSubquery, 'hp.event_instance_id', 'ei.id')
    .join(hostUsernameSubquery, 'u.host_user_id', 'hp.host_user_id')
    .leftJoin(participantCountSubquery, 'ap.ap_instance_id', 'ei.id')
    .leftJoin(attendantCountSubquery, 'ac.ac_instance_id', 'ei.id')
    .join(eventCategorySubquery, 'ec.category_id', 'e.event_category_id');

  return q;
};

const applyEventSelectColumns = (query: Knex.QueryBuilder) => {
  return query.select(
    'e.title',
    'e.description',
    'ei.location',
    'ei.id as id',
    'ec.label as category',
    'ei.created_at',
    'ei.ended_at',
    'e.spots_available',
    'u.host',
    db.raw('COALESCE(CAST(ap.interested_count AS INTEGER), 0) AS interested_count'),
    db.raw('COALESCE(CAST(ac.attendance_count AS INTEGER), 0) AS attendance_count'),
    db.raw('ST_AsGeoJSON(position)::json AS position')
  );
};

export function getEvent(
  ctx: Knex | Knex.Transaction,
  opts: {
    search?: string;
    includeParticipants?: boolean;
    ignoreExpired?: boolean;
  } = {}
) {
  const { search, includeParticipants, ignoreExpired } = opts;
  const q = getEventQuery(ctx, includeParticipants);
  if (search) {
    q.where(function () {
      const str = `%${search}%`;
      this.whereILike('e.title', str)
        .orWhereILike('e.description', str)
        .orWhereILike('u.host', str)
        .orWhereILike('ec.label', str);
    });

    if (ignoreExpired) {
      q.andWhere({ ended_at: null });
    }
  }

  if (ignoreExpired) {
    q.where({ ended_at: null });
  }

  applyEventSelectColumns(q);
  q.groupBy(
    'e.title',
    'e.description',
    'ei.location',
    'ei.position',
    'ei.id',
    'ec.label',
    'e.spots_available',
    'u.host',
    'ap.interested_count',
    'ac.attendance_count',
    'ei.created_at',
    'ei.ended_at'
  );
  q.orderBy('ei.created_at', 'asc');
  return q;
}
