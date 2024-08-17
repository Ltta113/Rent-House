const insertController = require('../services/insert')

const insert = async (req, res) => {
    try {
        const response = await insertController.insertService()
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Fail at auth controller: ' + error
        })
    }
}

module.exports = { insert }