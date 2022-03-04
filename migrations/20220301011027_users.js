exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.string("username").unique().notNullable();
    table.string("password").notNullable();
    table.string("token").notNullable();
    table.timestamp("token_expires").notNullable().defaultTo(knex.fn.now()); //for the token
    table.boolean("is_admin").notNullable().defaultTo(false);
    table.timestamps(true, true); // created_at and updated_at columns //for the user account
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
