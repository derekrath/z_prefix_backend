// const { app } = require('../ui/src/index.js');
const express = require('express');
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const knex = require('knex')(require('./knexfile.js')[process.env.NODE_ENV || 'development']);
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcrypt');

var bodyParser = require('body-parser')

const saltRounds = 10;
const { hash, compare } = bcrypt; 


function getPasswordHashByUser(username){
    knex.select('id', 'username', 'passwordHash')
    .from('users')
    .where({username})
    .then(data => {
      if (data.length > 0) {
        res.status(200).json(data[0].passwordHash)
      }
      else {
        res.status(404).json('No username found')
      }
    })
    .catch(err =>
      res.status(404).json('The data you are looking for could not be found. Please try again')
    );
    // return knex('users')
    //     .where({username})
    //     .select('passwordHash')
    //     .then((data) => data[0].passwordHash)
}

app.use(morgan());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//create user
app.post('/users', (req, res) => {
    let username = req.body.username;
    let passwordRaw = req.body.passwordRaw;
    console.log('user received:', [username, passwordRaw])
    hash(passwordRaw, saltRounds)
        .then((passwordHash) => {
            console.log('Raw password:', passwordRaw);
            console.log('Hashed Password', passwordHash);
            knex('users')
        // .where({username: username})
        // .then(result => {
            // console.log('createUser ', result);
            // if (result !== []) {
            //     res.status(409).send('This username is already in use.')
            // } else {
                // knex('users')
            .insert({ username: username, password: passwordHash })
            .returning('username')
                    // .then(newUser => res.status(201).json(newUser[0])
            .then((data) = res.status(201).json(`CREATED NEW USER ${username}`))

                        // res.status(201).json(result)
                    // )
                    //     // .then(data=>data);
                        // .then((data) = res.status(201).json(`CREATED NEW USER ${username}`))

            .catch((err) => res.status(500).json(err));
                    // }
                // })
                // .catch((err) => res.status(500).json(err));
        })
        // .catch((err) => res.status(500).json(err));
});

// app.post('/login', (req, res) => {
//     let user_name = req.body.user_name
//     let password = req.body.password
  
//     knex.select('id', 'user_name')
//       .from('users')
//       .where({ user_name })
//       .andWhere({ password })
//       .then((result) => {
//         if (result.length < 1) {
//           res.status(401).send("Invalid login")
//         } else {
//           res.json(result[0])
//         }
//       })
//   })

//login user
app.post('/login', (req, res) => {
    let { body } = req;
    let { username, passwordRaw } = body;
    // let user = req.params.user_name

    getPasswordHashByUser(username)
        .then((passwordHash) => {
            console.log('Raw password supplied:', passwordRaw)
            console.log('Hashed Password form db', passwordHash)
            // compare( passwordRaw, passwordHash )
            //     .then((isMatch) => {
            //         // if (isMatch) res.status(202).json('PASSWORDS MATCH');
            //         if (isMatch) res.status(202).json(result[0]);
            //         else res.status(401).json('NO PASSWORD MATCH');
            //     })
            //     .catch((err) => res.status(500).json(err))
        })
        .then(res.send())
});

//data demo:

app.get('/', async (req,res) => {
    console.log('Getting from /');
    const result = await knex('users')
        .select('*');
    res.status(200).json(result);
});

// app.post('/', async (req,res) => {
//     console.log('Posting from /');
//     let data = req.body;
//     const result = await knex('users')
//         .returning('*')
//         .insert(data)
//         .then(data => data)
//     res.status(200).json(result);
// });

app.listen(PORT
, () => {
    console.log(`Server is listening on http://localhost:${PORT}`)
})