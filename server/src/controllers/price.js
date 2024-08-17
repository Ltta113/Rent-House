const services = require('../services/price')

const getPrices = async (req, res) => {
    try {
        const response = await services.getPricesService()
        return res.status(200).json(response)

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at prices controller' + error
        })
    }
}
module.exports = { getPrices }