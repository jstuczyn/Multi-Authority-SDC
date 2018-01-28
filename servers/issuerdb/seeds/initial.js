exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('tblClients')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('tblClients')
        .insert([
          {
            Name: 'Client',
            Address: '127.0.0.1:9000',
            Balance: 1000.00,
          },
          {
            Name: 'Issuer',
            Address: '127.0.0.1:5000',
            Balance: 1000.00,
          },
        ]);
    });
};
