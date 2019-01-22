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
    loggedIn: (req, res) => {
        if (req.session.user) {
            res.status(200).send(req.session.user)
        } else {
            res.status(401).send('Please log in or create an account')
        }
    },
    logout: (req, res) => {
        req.session.destroy()
        res.redirect('http://localhost:3000/#/')
    },
    loopAuth: async (req, res) => {
        const db = req.app.get('db')
        const {id} = req.params

        // check if req.session.user.id === loop's creator_id
        const owner = await db.get_loop_owner({id: parseInt(id)})
        if (owner[0].creator_id === req.session.user.id) return res.sendStatus(200)

        // check if req.session.user.id is in share_table with this
        const shared = await db.get_shared_loops({id: req.session.user.id})
        if (shared) {
            var found = shared.filter(loop => loop.loop_id == id)
        }
        if (found.length > 0) {
            return res.sendStatus(200)
        }
        res.status(401).send({message: `You don't have access to this loop.`})
    }
}