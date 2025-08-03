import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import { Knex } from 'knex';

const getEventQuery = (ctx: Knex | Knex.Transaction, includeParticipants?: boolean) => {
  const q = ctx(db.raw('?? as e', [tablenames.event_data]))
    //Get the event instance.
    .join(db.raw('?? AS ei ON ei.event_data_id = e.id', [tablenames.event_instance]))
    //Get the host participant.
    .join(
      db.raw(
        "(SELECT user_id AS host_user_id, event_instance_id FROM ?? WHERE attendance_status_id IN (SELECT id FROM ?? WHERE label IN ('host'))) AS hp",
        [tablenames.event_attendance, tablenames.event_attendance_status]
      ),
      'hp.event_instance_id',
      'ei.id'
    )
    //Get the host username.
    .join(
      db.raw('(SELECT id as host_user_id, username as host FROM ??) as u', [tablenames.user]),
      'u.host_user_id',
      'hp.host_user_id'
    )
    //Get the participant count.
    .leftJoin(
      db.raw(
        "(SELECT event_instance_id AS ap_instance_id, attendance_status_id AS ap_status_id, COUNT(*) AS interested_count FROM ?? WHERE attendance_status_id IN (SELECT id FROM ?? WHERE label IN ('interested') LIMIT 1) GROUP BY event_instance_id, attendance_status_id) AS ap",
        [tablenames.event_attendance, tablenames.event_attendance_status]
      ),
      'ap.ap_instance_id',
      'ei.id'
    )
    //Get the event category.
    .join(
      db.raw('(SELECT id AS category_id, label FROM ??) AS ec', [tablenames.event_category]),
      'ec.category_id',
      'e.event_category_id'
    );
  return q;
};

const applyEventSelectColumns = (query: Knex.QueryBuilder) => {
  return query.select(
    'e.title',
    'e.description',
    'e.location',
    'ei.id as id',
    'ec.label as category',
    'ei.created_at',
    'ei.ended_at',
    'e.spots_available',
    'u.host',
    db.raw('COALESCE(CAST(ap.interested_count AS INTEGER), 0) AS interested_count')
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
        .orWhereILike('location', str)
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
    'e.location',
    'ei.id',
    'ec.label',
    'e.spots_available',
    'u.host',
    'ap.interested_count'
  );
  q.orderBy('ei.created_at', 'asc');
  return q;
}
