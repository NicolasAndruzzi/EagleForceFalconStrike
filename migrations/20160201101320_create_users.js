
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments();
    table.string('user_name');
    table.string('first_name');
    table.string('last_name');
    table.integer('score');
    table.string('title');
    table.boolean('is_admin');
    table.string('linkedin_id');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
