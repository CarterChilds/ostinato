require('dotenv').config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const {SERVER_PORT, CONNECTION_STRING, SECRET} = process.env

const loopCtrl = require('./loopController')
const authCtrl = require('./authController')

const app = express()

app.use(express.json())
app.use(session({
    secret: SECRET,
    saveUninitialized: false,
    resave: false
}))

// Endpoints for Authentication
app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.post('/auth/logout', authCtrl.logout)
app.get('/auth/me', authCtrl.loggedIn)
app.put('/auth/account', authCtrl.updateAccount)

// Endpoints for Editor View
app.get('/api/loop/:id', loopCtrl.getLoop)
app.put('/api/loop/:id', loopCtrl.saveLoop)
app.post('/api/loop', loopCtrl.newLoop)
app.delete('/api/loop/:id', loopCtrl.deleteLoop)

// Endpoints for Dashboard View
app.get('/api/loops', loopCtrl.getLoops)

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    app.listen(SERVER_PORT, () => console.log(`${SERVER_PORT} Rubber Ducks!`))
})