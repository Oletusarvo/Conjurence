const schemas = {
  users: 'users',
  events: 'events',
};

const tables = {
  user: 'user',
  user_status: 'user_status',
  user_contact: 'user_contact',
  user_contact_type: 'user_contact_type',
  /**The table containing the data for each event instance. */
  event_data: 'event_data',
  /**
   * The table containing the creation- and ending timestamp for events.
   * Refers to an event_data instance via an event_data_id.
   * */
  event_instance: 'event_instance',
  event_category: 'event_category',
  event_category_description: 'event_category_description',
  /**
   * Contains the interests to, and participations on an event instance.
   */
  event_participant: 'event_attendance',
  event_participant_status: 'event_attendance_status',
  event_threshold: 'event_threshold',
  event_threshold_description: 'event_threshold_description',
  notification: 'notification',
  notification_type: 'notification_type',
};

const getFullTableName = <ST extends string, TT extends string>(schema: ST, table: TT) =>
  `${schema}.${table}` as `${ST}.${TT}`;

export const tablenames = {
  user: getFullTableName(schemas.users, tables.user),
  user_status: getFullTableName(schemas.users, tables.user_status),
  user_contact: getFullTableName(schemas.users, tables.user_contact),
  user_contact_type: getFullTableName(schemas.users, tables.user_contact_type),
  event_data: getFullTableName(schemas.events, tables.event_data),
  event_instance: getFullTableName(schemas.events, tables.event_instance),
  event_category: getFullTableName(schemas.events, tables.event_category),
  event_category_description: getFullTableName(schemas.events, tables.event_category_description),
  event_attendance: getFullTableName(schemas.events, tables.event_participant),
  event_attendance_status: getFullTableName(schemas.events, tables.event_participant_status),
  event_threshold: getFullTableName(schemas.events, tables.event_threshold),
  event_threshold_description: getFullTableName(schemas.events, tables.event_threshold_description),
  notification: getFullTableName(schemas.users, tables.notification),
  notification_type: getFullTableName(schemas.users, tables.notification_type),
};
