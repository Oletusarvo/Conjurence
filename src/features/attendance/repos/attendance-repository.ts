import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import { DBContext } from '@/util/db-context';
import { Repository } from '@/util/repository';

export class AttendanceRepository extends Repository {
  /**Adds a .whereIn-clause to the passed query, filtering results where the attendance status is host, joined or interested. */
  private onlyActive(query: any) {
    return query.whereIn('attendance_status.label', ['host', 'joined', 'interested']);
  }

  private withEndingTimestamp(query: any) {
    return query.join(
      db
        .select('ended_at', 'id as instance_id_actual')
        .from(tablenames.event_instance)
        .as('instance'),
      'instance.instance_id_actual',
      'attendance.event_instance_id'
    );
  }

  private getBaseQuery(ctx: DBContext) {
    return ctx({ attendance: tablenames.event_attendance })
      .join(
        ctx.select('username', 'id as user_id_actual').from(tablenames.user).as('user'),
        'user.user_id_actual',
        'attendance.user_id'
      )
      .join(
        ctx
          .select('id as status_id_actual', 'label')
          .from(tablenames.event_attendance_status)
          .groupBy('status_id_actual')
          .as('attendance_status'),
        'attendance_status.status_id_actual',
        'attendance.attendance_status_id'
      )
      .select('attendance.*', 'attendance_status.label as status', 'username')
      .orderBy('attendance.requested_at', 'desc');
  }

  /**Updates an attendance by the query, and returns the updated record. */
  async updateBy({ query, payload }: { query: any; payload: any }, ctx: DBContext) {
    await ctx(tablenames.event_attendance)
      .where(query)
      .update(payload)
      .returning('event_instance_id');

    return await this.findBy(query, ctx).first();
  }

  /**Returns all attendances of a user. */
  async findByUserId(user_id: string, ctx: DBContext) {
    return await this.getBaseQuery(ctx).where({ user_id });
  }

  /**Returns all attendances on a specific event. */
  async findByEventInstanceId(event_instance_id: string, ctx: DBContext) {
    return await this.getBaseQuery(ctx).where({ event_instance_id });
  }

  /**Returns a knex query builder resolving to attendances matching the query. */
  findBy(query: any, ctx: DBContext) {
    return this.getBaseQuery(ctx).where(query);
  }

  /**Returns the current active attendance of a user, with status host, joined or interested.*/
  async findRecentActiveByUserId(user_id: string, ctx: DBContext) {
    return await this.withEndingTimestamp(
      this.onlyActive(this.getBaseQuery(ctx).where({ user_id, ended_at: null }).first())
    );
  }

  /**Returns the most recent attendance by a user regardless of its status. */
  async findRecentByUserId(user_id: string, ctx: DBContext) {
    return await this.getBaseQuery(ctx).where({ user_id }).first();
  }

  async create(payload: any, ctx: DBContext) {
    await ctx(tablenames.event_attendance).insert(payload);
    return await this.findRecentActiveByUserId(payload.user_id, ctx);
  }
}
