exports.seed = function (knex) {
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          username: "derekrath",
          password:
            "$2b$10$YTSmeGHIyb2AOaNCd9AeYesoxt2w3T1r0rrK3K2JejJHJTWFL9wQS",
          token: "1",
          is_admin: true,
        },
        {
          username: "admin",
          password:
            "$2b$10$Jy5omNDj36vhNlagqhtujuVZH74HElg2vL8421TZnjKaKBhZWFFhe",
          token: "1",
          is_admin: true,
        },
      ]);
    });
};
