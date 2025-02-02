const services = require('../services/area')

const getAreas = async (req, res) => {
    try {
        const response = await services.getAreaServices()
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at areas controller' + error
        })
    }
}
module.exports = { getAreas }