const db = require('../models');

const getProvinceService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Province.findAll({ 
            raw: true,
            attributes: ['code', 'value']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Failed to get provices',
            response
        })
    } catch (error) {
        reject(error)
    }
})

module.exports = { getProvinceService }