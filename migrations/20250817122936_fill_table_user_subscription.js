/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex('users.user_subscription').insert([
    { label: 'free', maximum_event_size_id: 1, allow_templates: false, allow_mobile_events: false },
    { label: 'pro', maximum_event_size_id: 2, allow_templates: true, allow_mobile_events: true },
    {
      label: 'enterprise',
      maximum_event_size_id: 3,
      allow_templates: true,
      allow_mobile_events: true,
    },
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex('users.user_subscription').del();
};
