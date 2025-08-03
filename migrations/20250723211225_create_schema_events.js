/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createSchema('events')
    .withSchema('events')
    .createTable('event_data', tbl => {
      tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
      tbl
        .uuid('author_id')
        .notNullable()
        .references('id')
        .inTable('users.user')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      tbl.string('title', 24).notNullable();
      tbl.string('description');
      tbl.string('location', 32);
      tbl.boolean('is_template').defaultTo(false);
    })
    .createTable('event_instance', tbl => {
      tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
      tbl
        .uuid('event_data_id')
        .notNullable()
        .references('id')
        .inTable('events.event_data')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      tbl.timestamp('created_at').defaultTo(knex.fn.now());
      tbl.timestamp('ended_at');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .withSchema('events')
    .dropTableIfExists('event_instance')
    .dropTableIfExists('event_data')
    .dropSchema('events');
};
