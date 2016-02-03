
exports.up = function(knex, Promise) {
  return knex.schema.createTable('posts', function(table) {
    table.increments();
    table.integer('author_id');
    table.integer('upvotes');
    table.integer('downvotes');
    table.text('body');
    table.string('cat_name');
    table.string('subject');
    table.timestamps(); 
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('posts');
};
