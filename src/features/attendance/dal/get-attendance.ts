import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import { Knex } from 'knex';

const getAttendanceQuery = (ctx: Knex | Knex.Transaction) =>
  ctx(db.raw('?? as ejr', [tablenames.event_attendance]))
    .join(db.raw('?? as u on u.id = ejr.user_id', [tablenames.user]))
    .join(
      db.select('ended_at as event_ended_at', 'id').from(tablenames.event_instance).as('e'),
      'e.id',
      'ejr.event_instance_id'
    )
    .join(
      db.raw('?? as ejs on ejs.id = ejr.attendance_status_id', [tablenames.event_attendance_status])
    );

const applyJoinRequestSelectColumns = (query: Knex.QueryBuilder) => {
  return query.select(
    'ejs.label as status',
    'u.username as username',
    'ejr.event_instance_id as event_instance_id',
    'ejr.user_id as user_id',
    'e.event_ended_at',
    'ejr.requested_at as requested_at',
    'ejr.updated_at as updated_as',
    'e.id as id'
  );
};

/**@deprecated */
export function getAttendance(ctx: Knex | Knex.Transaction) {
  const query = getAttendanceQuery(ctx);
  applyJoinRequestSelectColumns(query);
  return query;
}
