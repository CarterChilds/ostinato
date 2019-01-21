require('dotenv').config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const {SERVER_PORT, CONNECTION_STRING, SECRET, S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY} = process.env

const app = express()

// PACKAGES TO GET AWS S3 UPLOADING:
const AWS = require('aws-sdk')
const bluebird = require('bluebird')

// KEYS FOR ACCESSING AWS
AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
})

// Configure AWS to work with promises
AWS.config.setPromisesDependency(bluebird)

// S3 INSTANCE
const s3 = new AWS.S3()

// abstracts function to upload a file returning a promise
const uploadFile = (buffer, name, type) => {
    const params = {
        ACL: 'public-read',
        Body: buffer,
        Bucket: S3_BUCKET,
        ContentType: type.mime,
        Key: `${name}.${type.ext}`
    }
    return s3.upload(params).promise()
}
app.set('uploadFile', uploadFile)

// CONTROLLERS
const loopCtrl = require('./loopController')
const authCtrl = require('./authController')
const acctCtrl = require('./acctController')


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

// Endpoints for Editor View
app.get('/api/loop/:id', loopCtrl.getLoop)
app.put('/api/loop/:id', loopCtrl.saveLoop)
app.post('/api/loop', loopCtrl.newLoop)
app.delete('/api/loop/:id', loopCtrl.deleteLoop)

// Endpoints for Dashboard View
app.get('/api/loops', loopCtrl.getLoops)

// Endpoints for account editing
app.put('/auth/account', acctCtrl.updateAccount)
app.post('/api/profile-pic', acctCtrl.profilePic)

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    app.listen(SERVER_PORT, () => console.log(`${SERVER_PORT} Rubber Ducks!`))
})