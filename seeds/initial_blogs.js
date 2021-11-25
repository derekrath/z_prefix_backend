exports.seed = function(knex) {
  return knex('blogs').del()
    .then(function () {
      // Inserts seed entries
      return knex('blogs').insert([
        {blog_username: '$user1', title: 'How to Skin a Cat', content:'Thats rough'},
        {blog_username: '$user1', title: 'How to Ride a Dog', content:'Now thats better'},
        {blog_username: '$user2', title: 'How to Pet a Giraffe', content:'Jump high. Lorem ipsum. aoreet lectus a, sodales diam. Curabitur arcu massa, pretium eu ornare at, mattis et elit. In tincidunt.'}
      ]);
    });
};