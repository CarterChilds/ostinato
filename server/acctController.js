const bcrypt = require('bcryptjs')

const multiparty = require('multiparty')
const fs = require('fs')
const fileType = require('file-type')

module.exports = {
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
    },
    profilePic: async (req, res) => {
        const uploadFile = req.app.get('uploadFile')
        const form = new multiparty.Form()
        form.parse(req, async (error, fields, files) => {
        if (error) throw new Error(error);
        try {
            const path = files.file[0].path;
            const buffer = fs.readFileSync(path);
            const type = fileType(buffer);
            const timestamp = Date.now().toString();
            const fileName = `profilePics/${timestamp}-lg`;
            const data = await uploadFile(buffer, fileName, type);
            return res.status(200).send(data)
        } catch(error) {
            return res.status(400).send(error.message)
        }
    })
    }
}