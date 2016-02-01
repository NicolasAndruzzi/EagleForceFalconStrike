
exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments', function(table) {
    table.increments();
    table.integer('author_id');
    table.integer('post_id');
    table.integer('upvotes');
    table.integer('downvotes');
    table.text('body');
    table.timestamps();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('comments');
};
