require('dotenv').config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const {SERVER_PORT, CONNECTION_STRING, SECRET} = process.env

const controller = require('./controller')
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

// Endpoints for Editor View
app.get('/api/loop/:id', controller.getLoop)
app.put('/api/loop/:id', controller.saveLoop)
app.post('/api/loop', controller.newLoop)
app.delete('/api/loop/:id', controller.deleteLoop)

// Endpoints for Dashboard View
app.get('/api/loops/:id', controller.getLoops)

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    app.listen(SERVER_PORT, () => console.log(`${SERVER_PORT} Rubber Ducks!`))
})