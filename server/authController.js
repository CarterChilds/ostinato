const bcrypt = require('bcryptjs')
module.exports = {
    register: async (req, res) => {
        const db = req.app.get('db')
        const {name, email, username, password} = req.body

        // check if email already has account
        const account = await db.find_account({email})
        if (account[0]) return res.status(200).send({message: 'Email already in use'})

        // hash the password, create temporary profile pic
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const profilePic = `https://robohash.org/${username}`;

        // Add new account to database, place data on session
        const newAccArr = await db.create_account({name, email, profile_pic: profilePic, username, hash})
        req.session.user = {id: newAccArr[0].user_id, email: newAccArr[0].email, profilePic: profilePic, username: newAccArr[0].username, name: newAccArr[0].name}
        res.status(201).send({message: 'Logged in', userData: req.session.user, loggedIn: true})
    },
    login: async (req, res) => {
        const db = req.app.get('db')
        const {email, password} = req.body

        // check if email has an account
        const account = await db.find_account({email})
        if (!account[0]) return res.status(200).send({message: 'Email not found'})

        // check if password is correct
        const result = bcrypt.compareSync(password, account[0].hash)
        if (!result) return res.status(401).send({message: 'Incorrect password'})

        // place data on session
        req.session.user = {id: account[0].user_id, email: account[0].email, profilePic: account[0].profile_pic, username: account[0].username, name: account[0].name}
        res.status(200).send({message: 'Logged in', userData: req.session.user, loggedIn: true})
    },
    loggedIn: (req, res) => {
        const db = req.app.get('db')
        db.logged_in({id: req.session.user.id})
            .then(userInfo => {
                res.status(200).send(userInfo[0])
            })
            .catch(err => {
                res.status(200).send({message: 'Please log in or register for a new account'})
            })
    },
    logout: (req, res) => {
        req.session.destroy()
        res.redirect('http://localhost:3000/#/')
    }
}