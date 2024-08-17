const db = require('../models');
const { Op, where } = require('sequelize')
const { v4 } = require('uuid');
const moment = require('moment')
const generateCode = require('../ultis/generateCode')
const { generateDate } = require('../ultis/generateDate')


const getPostsService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Post.findAll({
            raw: true,
            nest: true, //Gom cac truon
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
                { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone'] },
            ],
            attributes: ['id', 'title', 'star', 'address', 'description']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Failed to get posts',
            response
        })
    } catch (error) {
        reject(error)
    }
})
const getPostsLimitService = (page, { limitPosts, order, ...query }, { priceNumber, areaNumber }) => new Promise(async (resolve, reject) => {
    try {
        let offset = (!page || +page <= 1) ? 0 : (+page - 1)
        const queries = { ...query }
        const limit = +limitPosts || +process.env.LIMIT
        queries.limit = limit
        if (priceNumber) query.priceNumber = { [Op.between]: priceNumber }
        if (areaNumber) query.areaNumber = { [Op.between]: areaNumber }
        if(order) queries.order = [order]
        const response = await db.Post.findAndCountAll({
            where: query,
            raw: true,
            nest: true,
            offset: offset * limit,
            ...queries,
            limit: +process.env.LIMIT,
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
                { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone', 'avatar'] },
                { model: db.Overview, as: 'overviews'}
            ],
            attributes: ['id', 'title', 'star', 'address', 'description']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Getting posts is failed.',
            response
        })

    } catch (error) {
        reject(error)
    }
})

const getNewPostService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Post.findAll({
            raw: true,
            nest: true,
            offset: 0,
            order: [['createdAt', 'DESC']],
            limit: +process.env.LIMIT,
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
            ],
            attributes: ['id', 'title', 'star', 'createdAt']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Getting posts is failed.',
            response
        })

    } catch (error) {
        reject(error)
    }
})

const createNewPostService = (body, userId) => new Promise(async (resolve, reject) => {
    try {
        const attributesId = v4()
        const imagesId = v4()
        const overviewId = v4()
        const labelCode = v4(body.label)
        const currentDate = generateDate()
        const hashtag = `#${Math.floor(Math.random() * Math.pow(10, 6))}`
        const response = await db.Post.create({
            id: v4(),
            title: body.title || null,
            labelCode,
            address: body.address || null,
            categoryCode: body.categoryCode || null,
            description: JSON.stringify(body.description) || null,
            userId,
            overviewId,
            imagesId,
            attributesId,
            areaCode: body.areaCode || null,
            priceCode: body.priceCode || null,
            provinceCode: body?.province?.includes('Thành phố') ? generateCode(body?.province?.replace('Thành phố ', '')) : generateCode(body?.province?.replace('Tỉnh ', '')) || null,
            priceNumber: body.priceNumber,
            areaNumber: body.areaNumber
        })
        await db.Attribute.create({
            id: attributesId,
            price: body.priceNumber < 1 ? `${+body.priceNumber * 1000000} đồng/tháng` : `${body.priceNumber} triệu/tháng`,
            acreage: `${body.areaNumber} m2`,
            published: moment(new Date).format('DD/MM/YYYY'),
            hashtag
        })
        await db.Image.create({
            id: imagesId,
            image: JSON.stringify(body.images)
        })
        await db.Overview.create({
            id: overviewId,
            code: hashtag,
            area: body.label,
            type: body.category,
            target: body.target,
            bonus: 'Tin thường',
            created: currentDate.today,
            expired: currentDate.expireDay,
        })
        await db.Province.findOrCreate({
            where: {
                [Op.or]: [
                    { value: body?.province?.replace('Thành phố ', '') },
                    { value: body?.province?.replace('Tỉnh ', '') }
                ]
            },
            defaults: {
                code: body?.province?.includes('Thành phố') ? generateCode(body?.province?.replace('Thành phố ', '')) : generateCode(body?.province?.replace('Tỉnh ', '')),
                value: body?.province?.includes('Thành phố') ? (body?.province?.replace('Thành phố ', '')) : (body?.province?.replace('Tỉnh ', ''))
            }
        })
        await db.Label.findOrCreate({
            where: {
                code: labelCode
            },
            defaults: {
                code: labelCode,
                value: body.label
            }
        })
        resolve({
            err: 0,
            msg: 'OK',
            response
        })

    } catch (error) {
        reject(error)
    }
})
const getPostsLimitAdminService = (page, id, query) => new Promise(async (resolve, reject) => {
    try {
        let offset = (!page || +page <= 1) ? 0 : (+page - 1)
        const queries = { ...query, userId: id }
        // console.log(queries)
        const response = await db.Post.findAndCountAll({
            where: queries,
            raw: true,
            nest: true,
            offset: offset * +process.env.LIMIT,
            order: [['createdAt', 'DESC']],
            // limit: +process.env.LIMIT,
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
                { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone'] },
                { model: db.Overview, as: 'overviews' },
            ],
            attributes: ['id', 'title', 'star', 'address', 'description', 'priceNumber', 'areaNumber', 'categoryCode', 'imagesId', 'attributesId', 'overviewId']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Getting posts is failed.',
            response
        })

    } catch (error) {
        reject(error)
    }
})

const updatePost = ({ postId, overviewId, imagesId, attributesId, ...body }) => new Promise(async (resolve, reject) => {
    try {
        const labelCode = v4(body.label)
        const currentDate = generateDate()
        const response = await db.Post.update({
            title: body.title,
            labelCode,
            address: body.address || null,
            categoryCode: body.categoryCode || null,
            description: JSON.stringify(body.description) || null,
            areaCode: body.areaCode || null,
            priceCode: body.priceCode || null,
            provinceCode: body?.province?.includes('Thành phố') ? generateCode(body?.province?.replace('Thành phố ', '')) : generateCode(body?.province?.replace('Tỉnh ', '')) || null,
            priceNumber: body.priceNumber,
            areaNumber: body.areaNumber
        }, {
            where: { id: postId }
        })
        await db.Attribute.update({
            price: body.priceNumber < 1 ? `${+body.priceNumber * 1000000} đồng/tháng` : `${body.priceNumber} triệu/tháng`,
            acreage: `${body.areaNumber} m2`,
        }, {
            where: { id: attributesId }
        })
        await db.Image.update({
            image: JSON.stringify(body.images)
        }, {
            where: { id: imagesId }
        })
        await db.Overview.update({
            area: body.label,
            type: body.category,
            target: body.target,
            created: currentDate.today,
            expired: currentDate.expireDay,
        }, {
            where: { id: overviewId }
        })
        await db.Province.findOrCreate({
            where: {
                [Op.or]: [
                    { value: body?.province?.replace('Thành phố ', '') },
                    { value: body?.province?.replace('Tỉnh ', '') }
                ]
            },
            defaults: {
                code: body?.province?.includes('Thành phố') ? generateCode(body?.province?.replace('Thành phố ', '')) : generateCode(body?.province?.replace('Tỉnh ', '')),
                value: body?.province?.includes('Thành phố') ? (body?.province?.replace('Thành phố ', '')) : (body?.province?.replace('Tỉnh ', ''))
            }
        })
        await db.Label.findOrCreate({
            where: {
                code: labelCode
            },
            defaults: {
                code: labelCode,
                value: body.label
            }
        })
        resolve({
            err: 0,
            msg: 'OK',
        })

    } catch (error) {
        reject(error)
    }
})

const deletePost = (postId) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Post.destroy({
            where: { id: postId }
        })
        resolve({
            err: response > 0 ? 0 : 1,
            msg: response ? 'Delete' : 'No post delete'
        })

    } catch (error) {
        reject(error)
    }
})


module.exports = { getPostsService, getPostsLimitService, getNewPostService, createNewPostService, getPostsLimitAdminService, updatePost, deletePost }