require('dotenv').config()
const { REFRESH_TOKEN, CLIENT_ID, CLIENT_SECRET } = process.env
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2


module.exports = {
    getLoop: async (req, res) => {
        const db = req.app.get('db')
        const { id: loop_id } = req.params
        const loop = await db.get_loop({ loop_id })
        res.status(200).send(loop)
    },
    saveLoop: (req, res) => {
        const db = req.app.get('db')
        const { title, tempo, instrument, key, row_1, row_2, row_3, row_4, row_5, row_6, row_7, row_8 } = req.body
        const { id } = req.params
        db.save_loop({ id, title, tempo, instrument, key, row_1, row_2, row_3, row_4, row_5, row_6, row_7, row_8 })
            .then(result => {
                res.status(200).send({ message: 'Loop saved!' })
            })
            .catch(err => {
                res.status(500).send(err.message)
            })
    },
    newLoop: (req, res) => {
        const db = req.app.get('db')
        db.new_loop({ creator_id: req.session.user.id })
            .then(result => {
                res.status(200).send(result[0])
            })
            .catch(err => {
                res.status(500).send(err.message)
            })
    },
    copyLoop: (req, res) => {
        const db = req.app.get('db')
        const { id: creator_id } = req.session.user
        let { title, tempo, instrument, key, row_1, row_2, row_3, row_4, row_5, row_6, row_7, row_8 } = req.body
        title = `${title} copy`
        db.copy_loop({ creator_id, title, tempo, instrument, key, row_1, row_2, row_3, row_4, row_5, row_6, row_7, row_8 })
            .then(result => {
                res.status(200).send(result[0])
            })
            .catch(err => {
                res.status(500).send(err.message)
            })
    },
    shareLoop: async (req, res) => {
        const db = req.app.get('db')
        const { id: loop_id } = req.params
        const { email } = req.body
        const { username: name } = req.session.user
        const sharedUser = await db.find_account({ email })
        if (sharedUser[0]) {
            await db.share_loop({ user_id: sharedUser[0].user_id, loop_id })
            return res.status(200).send({ message: `Loop shared with ${sharedUser[0].username}` })
        }
        // NODEMAILER *****************************************
        var emailContent = `<div style="min-width: 310px; text-align: center;"><header style="background: #bbb; height: 60px; width: 100%; padding: 15px 0;"><div style="margin: 0 auto; height: 100%;"><?xml version="1.0" encoding="UTF-8" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg width="100%" height="100%" viewBox="0 0 957 231" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><g><g id="O-Cogs-left" serif:id="O Cogs left"><circle cx="84.835" cy="142.798" r="75.717" style="fill:#fff;fill-opacity:0;stroke:#000;stroke-width:15px;"/><path d="M109.862,77.091l-0.582,1.527" style="fill:none;stroke:#000;stroke-width:15px;stroke-linecap:square;stroke-linejoin:miter;"/><path d="M60.39,206.801l-0.582,1.528" style="fill:none;stroke:#000;stroke-width:15px;stroke-linecap:square;stroke-linejoin:miter;"/><path d="M154.172,131.546l-1.614,0.26" style="fill:none;stroke:#000;stroke-width:15px;stroke-linecap:square;stroke-linejoin:miter;"/><path d="M17.113,153.613l-1.615,0.26" style="fill:none;stroke:#000;stroke-width:15px;stroke-linecap:square;stroke-linejoin:miter;"/><path d="M40.479,88.26l1.033,1.267" style="fill:none;stroke:#000;stroke-width:15px;stroke-linecap:square;stroke-linejoin:miter;"/><path d="M128.158,195.892l1.033,1.268" style="fill:none;stroke:#000;stroke-width:15px;stroke-linecap:square;stroke-linejoin:miter;"/></g><g id="O-Cogs-right" serif:id="O Cogs right"><circle cx="871.614" cy="142.798" r="75.717" style="fill:#fff;fill-opacity:0;stroke:#000;stroke-width:15px;"/><path d="M851.839,75.321l0.46,1.569" style="fill:none;stroke:#000;stroke-width:15px;stroke-linecap:square;stroke-linejoin:miter;"/><path d="M890.928,208.529l0.461,1.569" style="fill:none;stroke:#000;stroke-width:15px;stroke-linecap:square;stroke-linejoin:miter;"/><path d="M920.065,91.87l-1.128,1.184" style="fill:none;stroke:#000;stroke-width:15px;stroke-linecap:square;stroke-linejoin:miter;"/><path d="M824.29,192.366l-1.128,1.183" style="fill:none;stroke:#000;stroke-width:15px;stroke-linecap:square;stroke-linejoin:miter;"/><path d="M803.354,126.193l1.589,0.385" style="fill:none;stroke:#000;stroke-width:15px;stroke-linecap:square;stroke-linejoin:miter;"/><path d="M938.285,158.841l1.589,0.385" style="fill:none;stroke:#000;stroke-width:15px;stroke-linecap:square;stroke-linejoin:miter;"/></g><g transform="matrix(25.065,0,0,25.065,-9603.66,-10233.9)"><path d="M393.757,412.598l-1.089,0.58c-0.172,-0.352 -0.385,-0.528 -0.639,-0.528c-0.121,0 -0.225,0.04 -0.311,0.12c-0.086,0.081 -0.129,0.183 -0.129,0.308c0,0.219 0.254,0.436 0.762,0.651c0.699,0.3 1.17,0.578 1.412,0.832c0.242,0.253 0.364,0.595 0.364,1.025c0,0.551 -0.204,1.012 -0.61,1.383c-0.394,0.351 -0.871,0.527 -1.43,0.527c-0.957,0 -1.634,-0.467 -2.033,-1.4l1.125,-0.522c0.157,0.274 0.276,0.447 0.358,0.522c0.16,0.148 0.351,0.222 0.574,0.222c0.445,0 0.668,-0.203 0.668,-0.609c0,-0.234 -0.172,-0.453 -0.516,-0.656c-0.133,-0.067 -0.265,-0.131 -0.398,-0.194c-0.133,-0.062 -0.268,-0.127 -0.404,-0.193c-0.383,-0.187 -0.653,-0.375 -0.809,-0.562c-0.199,-0.239 -0.299,-0.545 -0.299,-0.92c0,-0.497 0.17,-0.907 0.51,-1.231c0.348,-0.324 0.769,-0.486 1.265,-0.486c0.731,0 1.274,0.377 1.629,1.131Z" style="fill-rule:nonzero;"/><path d="M396.285,412.855l0,4.477l-1.318,0l0,-4.477l-0.562,0l0,-1.23l0.562,0l0,-2.092l1.318,0l0,2.092l1.026,0l0,1.23l-1.026,0Z" style="fill-rule:nonzero;"/><path d="M399.214,411.625l0,5.707l-1.319,0l0,-5.707l1.319,0Zm-1.518,-2.373c0,-0.231 0.084,-0.43 0.252,-0.598c0.168,-0.168 0.369,-0.252 0.604,-0.252c0.238,0 0.441,0.084 0.609,0.252c0.168,0.164 0.252,0.366 0.252,0.604c0,0.238 -0.084,0.441 -0.252,0.609c-0.164,0.168 -0.365,0.252 -0.604,0.252c-0.238,0 -0.441,-0.084 -0.609,-0.252c-0.168,-0.168 -0.252,-0.373 -0.252,-0.615Z" style="fill-rule:nonzero;"/><path d="M399.852,411.625l1.324,0l0,0.527c0.461,-0.457 0.98,-0.685 1.558,-0.685c0.665,0 1.182,0.209 1.553,0.627c0.321,0.355 0.481,0.935 0.481,1.74l0,3.498l-1.325,0l0,-3.187c0,-0.563 -0.078,-0.952 -0.234,-1.166c-0.152,-0.219 -0.43,-0.329 -0.832,-0.329c-0.437,0 -0.748,0.145 -0.932,0.434c-0.179,0.285 -0.269,0.783 -0.269,1.494l0,2.754l-1.324,0l0,-5.707Z" style="fill-rule:nonzero;"/><path d="M409.703,411.625l1.324,0l0,5.707l-1.324,0l0,-0.598c-0.543,0.508 -1.127,0.762 -1.752,0.762c-0.789,0 -1.442,-0.285 -1.957,-0.855c-0.512,-0.582 -0.768,-1.309 -0.768,-2.18c0,-0.856 0.256,-1.568 0.768,-2.139c0.511,-0.57 1.152,-0.855 1.922,-0.855c0.664,0 1.259,0.273 1.787,0.82l0,-0.662Zm-3.129,2.836c0,0.547 0.146,0.992 0.439,1.336c0.301,0.348 0.68,0.521 1.137,0.521c0.488,0 0.883,-0.168 1.184,-0.504c0.3,-0.347 0.451,-0.789 0.451,-1.324c0,-0.535 -0.151,-0.976 -0.451,-1.324c-0.301,-0.34 -0.692,-0.51 -1.172,-0.51c-0.453,0 -0.832,0.172 -1.137,0.516c-0.301,0.348 -0.451,0.777 -0.451,1.289Z" style="fill-rule:nonzero;"/><path d="M413.27,412.855l0,4.477l-1.318,0l0,-4.477l-0.562,0l0,-1.23l0.562,0l0,-2.092l1.318,0l0,2.092l1.026,0l0,1.23l-1.026,0Z" style="fill-rule:nonzero;"/></g><g id="I-Cogs" serif:id="I Cogs"><path d="M373.704,42.018l24.885,-35.401" style="fill:none;stroke:#000;stroke-width:5px;stroke-linecap:square;stroke-linejoin:miter;"/><path d="M364.596,22.389l43.101,3.857" style="fill:none;stroke:#000;stroke-width:5px;stroke-linecap:square;stroke-linejoin:miter;"/><path d="M395.274,43.935l-18.254,-39.235" style="fill:none;stroke:#000;stroke-width:5px;stroke-linecap:square;stroke-linejoin:miter;"/></g></g></svg></div></header><div style="padding: 0 10px"><h1 style="font-family: Verdana, Geneva, Tahoma, sans-serif; font-size: 1.8em; margin: 10px 0;">Make music social again!</h1><p style='font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande", "Lucida Sans Unicode", Geneva, Verdana, sans-serif;'>Your friend ${name} wants to share their music creation with you! Click <a href="" style="text-decoration: none; font-style: italic; color: springgreen">here</a> to create an account and hear for youself</p></div></div>`
        const oauth2Client = new OAuth2(
            CLIENT_ID,
            CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        )
        oauth2Client.setCredentials({
            refresh_token: REFRESH_TOKEN
        })
        const tokens = await oauth2Client.refreshAccessToken()
        const accessToken = tokens.credentials.access_token

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'ostinatoloop@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })
        const mailOptions = {
            from: 'ostinatoloop@gmail.com',
            to: email,
            subject: 'Someone wants to share a creation on Ostinato',
            generateTextFromHTML: true,
            html: emailContent,
        }
        // NODEMAILER END *************************************
        transporter.sendMail(mailOptions, (error, response) => {
            error ? console.log(error) : smtpTransport.close();
        });
        return res.status(403).send({ message: `Email is not associated with any user` })
    },
    deleteLoop: async (req, res) => {
        const db = req.app.get('db')
        const { id } = req.params

        // check for loop ownership
        const owner = await db.get_loop_owner({ id: parseInt(id) })
        if (owner[0].creator_id !== req.session.user.id) return res.status(401).send({ message: `Only a loop's creator can delete it.` })

        await db.remove_share({ loop_id: id })
        db.delete_loop({ loop_id: id })
            .then(() => {
                res.status(200).send({ message: 'Loop deleted' })
            })
            .catch(err => {
                res.status(500).send(err.message)
            })
    },
    getUserLoops: (req, res) => {
        const db = req.app.get('db')
        const { id } = req.session.user
        db.get_user_loops({ id })
            .then(result => {
                res.status(200).send(result)
            })
            .catch(err => {
                res.status(500).send(err.message)
            })
    },
    getSharedLoops: (req, res) => {
        const db = req.app.get('db')
        const { id } = req.session.user
        db.get_shared_loops({ id })
            .then(result => {
                res.status(200).send(result)
            })
            .catch(err => {
                res.status(500).send(err.message)
            })
    }
}