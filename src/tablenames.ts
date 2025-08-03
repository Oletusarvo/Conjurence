const schemas = {
  users: 'users',
  events: 'events',
};

const tables = {
  user: 'user',
  user_status: 'user_status',
  /**The table containing the data for each event instance. */
  event_data: 'event_data',
  /**
   * The table containing the creation- and ending timestamp for events.
   * Refers to an event_data instance via an event_data_id.
   * */
  event_instance: 'event_instance',
  event_category: 'event_category',
  /**
   * Contains the interests to, and participations on an event instance.
   */
  event_participant: 'event_attendance',
  event_participant_status: 'event_attendance_status',
  notification: 'notification',
  notification_type: 'notification_type',
};

const getFullTableName = (schema: string, table: string) => `${schema}.${table}`;

export const tablenames = {
  user: getFullTableName(schemas.users, tables.user),
  user_status: getFullTableName(schemas.users, tables.user_status),
  event_data: getFullTableName(schemas.events, tables.event_data),
  event_instance: getFullTableName(schemas.events, tables.event_instance),
  event_category: getFullTableName(schemas.events, tables.event_category),
  event_attendance: getFullTableName(schemas.events, tables.event_participant),
  event_attendance_status: getFullTableName(schemas.events, tables.event_participant_status),
  notification: getFullTableName(schemas.users, tables.notification),
  notification_type: getFullTableName(schemas.users, tables.notification_type),
};
