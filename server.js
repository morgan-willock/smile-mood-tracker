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
// const cors = require('cors')

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

app.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure' }), (req, res) => {
    res.json({ login: "success" })
})

app.get('/login-failure', (req, res) => {
    res.send({ login: "failed" })
})

app.post('/register', async (req, res) => {

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

app.post('/mood', isAuth, async (req, res) => {

    const { userId, moodSelection, activities } = req.body

    pool.query('insert into moods (id, mood_selection, activities) values ($1, $2, $3);', [userId, moodSelection, activities])
    console.log(req.body)
    res.json({ message: 'success' })
})

app.post('/verify-mood', isAuth, async (req, res) => {

    const { userId, todaysDateConverted } = req.body
    const dbResponse = await pool.query('select * from moods where id = $1 and input_date = current_date;', [userId])

    if (dbResponse.rowCount > 0) {
        res.json({ message: 'success' })
    } else {
        console.log('arrived')
        res.json({ message: 'failed' })
    }
})

app.post('/edit-mood', isAuth, async (req, res) => {

    const { userId, date, moodSelection, activities } = req.body

    const dbResponse = await pool.query('select * from moods where id = $1 and input_date = $2;', [userId, date])

    if (dbResponse.rowCount > 0) {

        pool.query('update moods set mood_selection = $1,  activities = $2 where id = $3 and input_date = $4;', [moodSelection, activities, userId, date])

        res.json({ message: 'success' })
    } else {

        pool.query('insert into moods (id, input_date,mood_selection, activities) values ($1, $2, $3, $4);', [userId, date, moodSelection, activities])

        res.json({ message: 'updated' })
    }
})

app.post('/mood-details', isAuth, async (req, res) => {

    const { userId, date } = req.body
    const dbResponse = await pool.query('select * from moods where id = $1 and input_date = $2;', [userId, date])

    res.json(dbResponse)
})

app.post('/retrieve-moods', isAuth, async (req, res) => {

    const { userId } = req.body
    const dbResponse = await pool.query('select * from moods where id = $1;', [userId])

    res.json(dbResponse.rows)
})

app.get('/logout', (req, res) => {
    req.logout()
    res.json({ logout: "success" })
})

app.get('/protected-route', isAuth, (req, res) => {
    res.json({ authorized: true, userId: req.user.rows[0].id })
})

// PORT CONNECTION
app.listen(port, () => {
    console.log(`Now listening on port: ${port}`)
})

