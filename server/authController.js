const bcrypt = require('bcryptjs')
module.exports = {
    register: async (req, res) => {
        const db = req.app.get('db')
        const { name, email, username, password } = req.body

        // check if email already has account
        const account = await db.find_account({ email })
        if (account[0]) return res.status(200).send({ message: 'Email already in use' })

        // hash the password, create temporary profile pic
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const profilePic = `https://robohash.org/${username}`;

        // Add new account to database, place data on session
        const newAccArr = await db.create_account({ name, email, profile_pic: profilePic, username, hash })
        req.session.user = { id: newAccArr[0].user_id, email: newAccArr[0].email, profilePic: profilePic, username: newAccArr[0].username, name: newAccArr[0].name }
        res.status(201).send({ message: 'Logged in', userData: req.session.user, loggedIn: true })
    },
    login: async (req, res) => {
        const db = req.app.get('db')
        const { email, password } = req.body

        // check if email has an account
        const account = await db.find_account({ email })
        if (!account[0]) return res.status(200).send({ message: 'Email not found' })

        // check if password is correct
        const result = bcrypt.compareSync(password, account[0].hash)
        if (!result) return res.status(401).send({ message: 'Incorrect password' })

        // place data on session
        req.session.user = { id: account[0].user_id, email: account[0].email, profilePic: account[0].profile_pic, username: account[0].username, name: account[0].name }
        res.status(200).send({ message: 'Logged in', userData: req.session.user, loggedIn: true })
    },
    loggedIn: (req, res, next) => {
        if (req.session.user) {
            res.status(200).send(req.session.user)
        } else {
            res.status(401).send('Please log in or create an account')
        }
        // const db = req.app.get('db')
        // db.logged_in({id: req.session.user.id})
        //     .then(userInfo => {
        //         res.status(200).send(userInfo[0])
        //     })
        //     .catch(err => {
        //         res.status(200).send({message: 'Please log in or register for a new account'})
        //     })
    },
    logout: (req, res) => {
        req.session.destroy()
        res.redirect('http://localhost:3000/#/')
    },
    updateAccount: async (req, res) => {
        const db = req.app.get('db')
        const { email, profilePic: profile_pic, username, name, currentPass, newPass1 } = req.body
        const { id } = req.session.user

        // check if password is correct
        const account = await db.find_account_by_id({ id: req.session.user.id })
        const result = bcrypt.compareSync(currentPass, account[0].hash)
        if (!result) return res.status(401).send({ message: 'Incorrect password' })

        // if the user is updating his password
        if (newPass1.length > 0) {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(newPass1, salt)
            const newAcctInfo = await db.edit_account_password({ email, hash, profile_pic, username, name, user_id: id })
            req.session.user = { id: newAcctInfo[0].user_id, email: newAcctInfo[0].email, profilePic: newAcctInfo[0].profile_pic, username: newAcctInfo[0].username, name: newAcctInfo[0].name }
            return res.status(200).send({ message: 'Password changed', userData: req.session.user })
        }

        // if the user is only updating his non-password data
        const newAcctInfo = await db.edit_account({ email, profile_pic, username, name, user_id: id })
        req.session.user = { id: newAcctInfo[0].user_id, email: newAcctInfo[0].email, profilePic: newAcctInfo[0].profile_pic, username: newAcctInfo[0].username, name: newAcctInfo[0].name }
        return res.status(200).send({ message: 'Account updated', userData: req.session.user })
    }
}