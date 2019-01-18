module.exports = {
    getLoop: async (req, res) => {
        const db = req.app.get('db')
        const {id:loop_id} = req.params
        const loop = await db.get_loop({loop_id})
        res.status(200).send(loop)
    },
    saveLoop: (req, res) => {
        const db = req.app.get('db')
        const {title, tempo, key, row_1, row_2, row_3, row_4, row_5, row_6, row_7, row_8} = req.body
        const {id} = req.params
        db.save_loop({id, title, tempo, key, row_1, row_2, row_3, row_4, row_5, row_6, row_7, row_8})
            .then(result => {
                res.status(200).send({message: 'Loop saved!'})
            })
            .catch(err => {
                res.status(500).send(err.message)
            })
    },
    newLoop: async (req, res) => {
        const db = req.app.get('db')
        const newID = await db.new_loop()
        db.join_user_and_loop({user_id: req.session.user.id, loop_id: newID[0].loop_id})
            .then(result => {
                res.status(200).send(result[0])
            })
            .catch(err => {
                res.status(500).send(err.message)
            })
    },
    deleteLoop: (req, res) => {
        const db = req.app.get('db')
        const {id} = req.params
        db.delete_loop({loop_id: id})
            .then(() => {
                res.status(200).send({message: 'Loop deleted'})
            })
            .catch(err => {
                res.status(500).send(err.message)
            })
    },
    getLoops: (req, res) => {
        const db = req.app.get('db')
        const {id} = req.session.user
        db.get_user_loops({id})
            .then(result => {
                res.status(200).send(result)
            })
            .catch(err => {
                res.status(500).send(err.message)
            })
    }
}