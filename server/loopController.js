module.exports = {
    getLoop: async (req, res) => {
        const db = req.app.get('db')
        const {id:loop_id} = req.params
        const loop = await db.get_loop({loop_id})
        res.status(200).send(loop)
    },
    saveLoop: (req, res) => {
        const db = req.app.get('db')
        const {title, tempo, instrument, key, row_1, row_2, row_3, row_4, row_5, row_6, row_7, row_8} = req.body
        const {id} = req.params
        db.save_loop({id, title, tempo, instrument, key, row_1, row_2, row_3, row_4, row_5, row_6, row_7, row_8})
            .then(result => {
                res.status(200).send({message: 'Loop saved!'})
            })
            .catch(err => {
                res.status(500).send(err.message)
            })
    },
    newLoop: (req, res) => {
        const db = req.app.get('db')
        db.new_loop({creator_id: req.session.user.id})
            .then(result => {
                res.status(200).send(result[0])
            })
            .catch(err => {
                res.status(500).send(err.message)
            })
    },
    shareLoop: (req, res) => {

    },
    deleteLoop: async (req, res) => {
        const db = req.app.get('db')
        const {id} = req.params

        // check for loop ownership
        const owner = await db.get_loop_owner({id: parseInt(id)})
        if (owner[0].creator_id !== req.session.user.id) return res.status(401).send({message: `Only a loop's creator can delete it.`})

        db.delete_loop({loop_id: id})
            .then(() => {
                res.status(200).send({message: 'Loop deleted'})
            })
            .catch(err => {
                res.status(500).send(err.message)
            })
    },
    getUserLoops: (req, res) => {
        const db = req.app.get('db')
        const {id} = req.session.user
        db.get_user_loops({id})
            .then(result => {
                res.status(200).send(result)
            })
            .catch(err => {
                res.status(500).send(err.message)
            })
    },
    getSharedLoops: (req, res) => {
        const db = req.app.get('db')
        const {id} = req.session.user
        db.get_shared_loops({id})
            .then(result => {
                res.status(200).send(result)
            })
            .catch(err => {
                res.status(500).send(err.message)
            })
    }
}