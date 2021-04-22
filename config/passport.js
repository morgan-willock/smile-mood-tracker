const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const validPassword = require('../lib/passwordUtil').validPassword
const { Pool } = require('pg')

const pool = new Pool({
    database: 'smile'
})

const customFields = {
    usernameField: 'uname',
    passwordField: 'pw'
};

// username is the req.body username
const verifyCallback = (username, password, done) => {
    pool
        .query('SELECT * FROM users WHERE email = $1;', [username])
        .then(db => {
            if(!db.rows) { return done (null, false) }

            const user = db.rows[0]
            const hashedPassword = db.rows[0].hash
            const isValid = validPassword(password, hashedPassword)

            isValid.then((valid) => {
                if (valid) {
                    return done(null, user)
                } else {
                    return done(null, false)
                }
            })
        })
        .catch((err) => {
            done(err) 
        })
}

const strategy = new LocalStrategy(customFields, verifyCallback); 

passport.use(strategy);
 
passport.serializeUser((user, done) => {
    console.log(user)
    done(null, user.email)
})

passport.deserializeUser((userEmail, done) => {
    console.log(userEmail)
    pool
        .query('SELECT * FROM users WHERE email = $1;', [userEmail])
        .then((user) => {
            done(null, user)
        })
        .catch(err => done(err))
})