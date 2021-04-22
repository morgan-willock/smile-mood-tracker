if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const port = 8080;
const passport = require('passport');
const session = require('express-session');
const { Pool } = require('pg');
const genPassword = require('./lib/passwordUtil').genPassword;
const isAuth = require('./lib/authMiddleware').isAuth

app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

const pool = new Pool({
    database: 'smile'
})

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

// config for passport module so server.js knows about it
require('./config/passport'); 
// mandatory to go after app.use(session)
app.use(passport.initialize())
app.use(passport.session())

// used for checking session
// app.use((req, res, next) => {
//     console.log(req.session)
//     console.log(req.user)
//     next()
// })

// ROUTES //
app.get('/test', (req, res) => {
    let id = 2
    pool
        .query('SELECT * FROM users WHERE id = $1;', [id])
        .then(db => res.send(db.rows))
        .catch(err => console.error('Error executing query', err.stack))
})

app.post('/test', (req, res) => {
    console.log(req.body)
    res.json(req.body)
}) 

app.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure' }), (req, res) => {
    res.json({ login: "success" })
})

app.get('/login-failure', (req, res) => {
    res.send({ login: "failed" })
})

app.get('/test', (req, res) => {
    let id = 2
    pool
        .query('SELECT * FROM users WHERE id = $1;', [id])
        .then(db => res.send(db.rows))
        .catch(err => console.error('Error executing query', err.stack))
})

app.post('/register', async (req, res, next) => {
    const hashedPassword = await genPassword(req.body.pw)
    const email = req.body.uname

    pool
        .query('insert into users (email, hash) values ($1, $2);', [email, hashedPassword])

    res.json({ Register: 'Success' })
})

app.get('/logout', (req, res, next) => {
    req.logout()
    res.json({ logout: "success" })
})

app.get('/protected-route', isAuth, (req, res, next) => {
    res.send('You made it')
})

// PORT CONNECTION
app.listen(port, () => {
    console.log(`Now listening on port: ${port}`)
})

