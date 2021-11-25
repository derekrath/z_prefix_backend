exports.up = function(knex) {
    return knex.schema.createTable('blogs', table => {
        table.increments('id');
        table.string('blog_username').notNullable();
        table.string('title').notNullable();
        table.text('content').notNullable();
        table.timestamps(true, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('blogs')
};