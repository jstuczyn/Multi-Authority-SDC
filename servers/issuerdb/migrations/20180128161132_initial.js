
exports.up = function(knex, Promise) {
  return knex.schema.createTable('tblGeneratedIds', (table) => {
    table.string('Id').notNull().primary();
  }).createTable('tblUsedIds', (table) => {
    table.string('Id').notNull().primary();
  }).createTable('tblClients', (table) => {
    table.string('Address').notNull();
    table.string('Name').notNull();
    table.decimal('Balance', 16, 2).notNull();
    table.primary(['Name', 'Address']);
  });
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('tblGeneratedIds'),
    knex.schema.dropTable('tblUsedIds'),
    knex.schema.dropTable('tblClients'),
  ]);
};
