const db = require('../models');

const getCategoriesService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Category.findAll({ 
            raw: true
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Failed to get categories',
            response
        })
    } catch (error) {
        reject(error)
    }
})

module.exports = { getCategoriesService }