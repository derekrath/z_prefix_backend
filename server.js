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
            // console.log('Raw password:', passwordRaw);
            // console.log('Hashed Password', passwordHash);
            knex('users')
            .where({username: username})
            .then(data => {
                if (data.length > 0 ) {
                    res.status(409).send('This username is already in use.')
                } else {
                    knex('users')
                    .insert({ username: username, password: passwordHash })
                    .returning('username')
                    .then((data) = res.status(201).json(`CREATED NEW USER ${username}`))
                }})
            .catch((err) => res.status(500).json(err))
        })
        .catch((err) => res.status(500).json(err));
});

//login user
app.post('/login', (req, res) => {
    let username = req.body.username;
    let passwordRaw = req.body.passwordRaw;
    knex.select('username', 'password')
        .from('users')
        .where({username: username})
        .then(data => {
            if (data.length > 0) {
                let passwordHash = data[0].password;
                compare( passwordRaw, passwordHash )
                .then((isMatch) => {
                    if (isMatch) {
                        res.status(202).json(data[0]) /// give me the user info when there is a match
                    } else {
                        res.status(401).json('NO PASSWORD MATCH')
                    }
                })
                .catch((err) => res.status(500).json(err))
            }
            else {
                res.status(404).json('No username found')
            }
        })
        .catch(err =>
            res.status(404).json('The data you are looking for could not be found. Please try again')
        )
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