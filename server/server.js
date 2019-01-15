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

// Endpoints for Editor View
app.get('/api/loop/:id', controller.getLoop)
app.put('/api/loop/:id', controller.saveLoop)


massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    app.listen(SERVER_PORT, () => console.log(`${SERVER_PORT} Rubber Ducks!`))
})