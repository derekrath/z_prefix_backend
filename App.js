const express = require("express");
const app = express();
//set environment variable to development if not yet provided by heroku (will set to production)
const knex = require("knex")(
  require("./knexfile.js")[process.env.NODE_ENV || "development"]
);

const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcrypt");

// var bodyParser = require('body-parser')

// change package.json from node to nodemon to use nodemon for development:
//"start": "npx knex migrate:rollback && npx knex migrate:latest && npx knex seed:run && nodemon server.js",

const saltRounds = 10;
const { hash, compare } = bcrypt;

app.use(morgan());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//get userID by username
async function getUserIdByUsername(username) {
  return await knex
    .select("id")
    .from("users")
    .where("username", username)
    .then((data) => {
      if (data.length === 0) {
        return null;
      }
      let userID = data[0].id;
      return userID;
    });
}

//create new user
app.post("/users", (req, res) => {
  let user_name = req.body.username;
  let password_raw = req.body.password;
  hash(password_raw, saltRounds)
    .then((passwordHash) => {
      knex("users")
        .where({ username: user_name })
        .then((data) => {
          if (data.length > 0) {
            // res.status(409).send("This username is already in use.");
            res.status(409).send(`${user_name} is already in use.`);
          } else {
            knex("users")
              .insert({
                username: user_name,
                password: passwordHash,
                is_admin: false,
              })
              .returning("username")
              .then(
                (data = res.status(201).json(`Created new user ${user_name}.`))
              )
              .catch((err) => res.status(500).json(err));
          }
        })
        .catch((err) => res.status(500).json(err));
    })
    .catch((err) => res.status(500).json(err));
});

//login user
app.post("/login", (req, res) => {
  let user_name = req.body.username;
  let password_raw = req.body.password;
  let today = new Date();
  knex
    .select("username", "password", "token", "is_admin", "token_expires") //need to also get the temp password
    .from("users")
    .where({ username: user_name })
    // .where("token_expires", ">=", today)
    .then((data) => {
      if (data.length > 0) {
        let token = data[0].token;
        if (token === password_raw) {
          data = {
            username: data[0].username,
            password: data[0].token,
            isAdmin: data[0].is_admin,
            expiration: data[0].token_expires,
          };
          res.status(200).json(["SUCCESS", data]);
        } else {
          let passwordHash = data[0].password;
          compare(password_raw, passwordHash)
            .then((isMatch) => {
              if (isMatch) {
                data = {
                  username: data[0].username,
                  password: data[0].token,
                  isAdmin: data[0].is_admin,
                  expiration: data[0].token_expires,
                };
                res.status(200).json(["SUCCESS", data]);
              } else {
                res.status(401).json("Incorrect Password.");
              }
            })
            .catch((err) => res.status(500).json(err));
        }
      } else {
        res.status(404).json(`Username ${user_name} not found.`);
      }
    })
    .catch((err) => res.status(404).json("404 Not Found."));
});

app.put("/login", (req, res) => {
  let user_name = req.body.username;
  let expiration = req.body.expiration;
  knex
    .from("users")
    .where({ username: user_name })
    .update("token_expires", expiration)
    .catch((err) => res.status(500).json(err));
});

// //demo data
app.get("/", async (req, res) => {
  const result = await knex("users").select("*");
  res.status(200).json(result);
});

app.get("/blogs", async (req, res) => {
  const result = await knex("blogs").select("*");
  res.status(200).json(result);
});

//get blogs for user
app.get("/blogs/:username", async (req, res) => {
  // let username = req.body.username;
  let username = req.params.username;
  // knex
  //   .from("blogs")
  //   // .innerJoin("users", "blogs.username", "users.username")
  //   .select(
  //     //for Inner-join situation:
  //     // "blogs.username",
  //     // "blogs.title",
  //     // "blogs.content",
  //     // "blogs.updated_at"
  //     //Otherwise:
  //     "*"
  //     //or:
  //     // "username",
  //     // "title",
  //     // "content",
  //     // "updated_at"
  //   )
  //   .where({ username: username })
  //   .then((data) => {
  //     res.status(201).json(data);
  //   })
  //   .catch((err) => res.status(404).json("No blogs posted"));

  //simplified
  const result = await knex("blogs").select("*").where("username", username);
  res.status(200).json(result);
});

//create blog
app.post("/blogs/:username", async (req, res) => {
  let username = req.params.username;
  let title = req.body.title;
  let content = req.body.content;
  await knex
    .from("blogs")
    .where({ username: username })
    .insert({
      username: username,
      title: title,
      content: content,
    })
    .returning("*")
    .then((data) => res.status(201).json(`BLOG CREATED ${data}`))
    .catch((err) => res.status(500).json(err));
});

//edit blog
app.put("/blogs/:username", async (req, res) => {
  let username = req.params.username;
  let title = req.body.title;
  let content = req.body.content;
  await knex
    .from("blogs")
    .where({ username: username })
    .where({ title: title })
    .update("content", content)
    .returning("*")
    // .then(function (data) {
    //   console.log(data);
    //   res.send(data);
    // })
    .then((data) => res.status(201).json(`BLOG UPDATED ${data}`))
    .catch((err) => res.status(500).json(err));
});

//delete blog
app.delete("/blogs/:username", async (req, res) => {
  let username = req.params.username;
  const title = req.body.title;
  await knex("blogs")
    // .where({ username: username })
    // .where({ title: blog_title })
    .where("username", username)
    .where("title", title)
    .del()
    // .then(function () {
    //   console.log(data);
    //   res.send(data);
    // })
    // .returning("title")
    // .then((data = res.status(201).json(`BLOG DELETED ${title}`)))
    .then(res.status(201).send("Blog deleted."))
    //
    // .then(function () {
    //   knex
    //     .select("username", "title", "content", "updated_at")
    //     .where({ username: username })
    //     .then((data) => {
    //       res.status(201).json(data);
    //     })
    //     .catch((err) => res.status(404).json("No blogs posted"));
    // })
    .catch((err) => res.status(500).json(err));
});

module.exports = { app, knex };
