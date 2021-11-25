exports.seed = function(knex) {
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {user_username: '$user1', password: 'gkhbjc'},
        {user_username: '$user2', password: 'ufjhvm'},
      ]);
    });
};