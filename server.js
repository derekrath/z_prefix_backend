// const { app } = require('../ui/src/index.js');
const express = require('express');
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const knex = require('knex')(require('./knexfile.js')[process.env.NODE_ENV || 'development']);
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcrypt');

// var bodyParser = require('body-parser')

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
            knex('users')
            .where({user_username: username})
            .then(data => {
                if (data.length > 0 ) {
                    res.status(409).send('This username is already in use.')
                } else {
                    knex('users')
                    .insert({ user_username: username, password: passwordHash })
                    .returning('user_username')
                    .then((data) = res.status(201).json(`CREATED NEW USER ${username}`))
                }})
            .catch((err) => res.status(500).json(err))
        })
        .catch((err) => res.status(500).json(err));
});

//login user
app.post('/login', (req, res) => {
    let username = req.body.username;
    console.log('request username: ', username)
    let passwordRaw = req.body.passwordRaw;
    knex.select('user_username', 'password')
        .from('users')
        .where({user_username: username})
        .then(data => {
            console.log('data match:', data)
            if (data.length > 0) {
                let passwordHash = data[0].password;
                compare( passwordRaw, passwordHash )
                .then((isMatch) => {
                    if (isMatch) {
                        res.status(200).json('SUCCESS')
                    } else {
                        res.status(401).json('NO PASSWORD MATCH')
                    }
                })
                .catch((err) => res.status(500).json('heloooooooo'))
            }
            else {
                res.status(404).json('No username found')
            }
        })
        .catch(err =>
            res.status(404).json('The data you are looking for could not be found. Please try again')
        )
});

//demo data
app.get('/', async (req,res) => {
    console.log('Getting from /');
    const result = await knex('users')
    .select('*');
    res.status(200).json(result);
});

app.get('/blogs', async (req,res) => {
    console.log('Getting from /blogs');
    const result = await knex('blogs')
    .select('*');
    res.status(200).json(result);
});

//get blogs for user
app.get('/blogs/:username', (req, res) => {
    // let username = req.body.username;
    let username = req.params.username;
    console.log('searching blogs for username: ', username)
    knex.from('blogs').innerJoin('users', 'blogs.blog_username', 'users.user_username')
        .select('blogs.blog_username', 'blogs.title', 'blogs.content', 'blogs.updated_at')
        .where({blog_username: username})
        .then(data => {
            console.log('data from search:', data);
            res.status(201).json(data)})
        .catch(err =>
            res.status(404).json('No blogs posted')
        )
});

//create blog
app.post('/blogs', (req, res) => {
    let blog_username = req.body.blog_username;
    let title = req.body.title;
    let content = req.body.content;
    //check if user exists
    knex('users')
        .where({user_username: blog_username})
        .then(data => {
            if (data.length > 0 && content.length < 100 ) {
                //if user exists, post blog for user
                console.log('data.length: ', data.length)
                knex('blogs')
                .insert({ blog_username: blog_username, title: title, content: content })
                .returning('title')
                .then((data) = res.status(201).json(`BLOG CREATED ${title}`))
            } else {
                console.log('401 Please Login')
                res.status(401).send('Please Login.')
                //dont post blog for user
            }
        })
        .catch((err) => res.status(500).json(err))
});

//edit blog
app.put('/blogs', (req, res) => {
    let blog_username = req.body.blog_username;
    let title = req.body.title;
    let content = req.body.content;
    //check if user exists
    knex('users')
        .where({user_username: blog_username})
        .then(data => {
            if (data.length > 0 && content.length < 100 ) {
                //if user exists, post blog for user
                console.log('data.length: ', data.length)
                knex('blogs')
                .where({title: title})
                .update({
                    content: content})
                .returning('title')
                .then((data) = res.status(201).json(`BLOG UPDATED ${title}`))
            } else {
                console.log('401 Please Login')
                res.status(401).send('Please Login.')
                //dont post blog for user
            }
        })
        .catch((err) => res.status(500).json(err))
});

//delete blog
app.delete('/blogs/:title', (req, res) => {
    const blog_title = req.params.title;
    knex('blogs')
        .where({title: blog_title})
        .del()
        .catch((err) => res.status(500).json(err))
});

app.listen(PORT
, () => {
    console.log(`Server is listening on http://localhost:${PORT}`)
})