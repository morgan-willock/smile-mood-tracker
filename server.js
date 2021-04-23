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
const cors = require('cors')

app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

const pool = new Pool({
    database: 'smile'
})

// app.use(cors({ origin: 'http://localhost:3000' }))

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

app.post('/register', async (req, res, next) => {

    const hashedPassword = await genPassword(req.body.password)
    const email = req.body.email
    const dbResponse = await pool.query('SELECT EXISTS (SELECT true FROM users WHERE email = $1);', [email])
    const emailExistsBool = dbResponse.rows[0].exists

    if (!emailExistsBool) {
        pool.query('insert into users (email, hash) values ($1, $2);', [email, hashedPassword])
        console.log("email inserted into db")
        res.json({ register: 'success' })
    } else {
        console.log("email taken")
        res.json({ register: 'failed' })
    }
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

