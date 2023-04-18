/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function (knex) {
  return knex.schema.createTable("workspace_to_data_source", function (table) {
    table.increments("id").primary().unsigned();
    table.integer("workspace_id").notNullable();
    table.integer("data_source_id", 255).notNullable();
    table.timestamps(true, true); //Add created_at and also updated_at
    table.primary(["workspace_id", "data_source_id"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTableIfExists("workspace_to_data_source"),
  ]);
};
