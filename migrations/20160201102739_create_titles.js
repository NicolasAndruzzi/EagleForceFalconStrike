
exports.up = function(knex, Promise) {
  return knex.schema.createTable('titles', function(table) {
    table.increments();
    table.string('title');
    table.integer('score');
    table.string('avatar_style');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('titles');
};
