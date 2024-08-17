const db = require('../models');

const getAreaServices = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Area.findAll({ 
            raw: true,
            attributes: ['code', 'value', 'order']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Failed to get area',
            response
        })
    } catch (error) {
        reject(error)
    }
})

module.exports = { getAreaServices }