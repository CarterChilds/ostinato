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
                console.log(err.message)
            })
    }
}