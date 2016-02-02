
exports.up = function(knex, Promise) {
  return knex.schema.createTable('login', function(table){
    table.increments();
    table.string('user_name');
    table.string('password');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('login');
};
