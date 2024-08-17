const moment = require('moment')

const formatDate = (timeObj) => {
    let day = timeObj.getDay() === 0 ? 'Chủ Nhật' : `Thứ ${timeObj.getDay() + 1}`
    let date = `${timeObj.getDate()}/${timeObj.getMonth() + 1}/${timeObj.getFullYear()}`
    let time = `${timeObj.getHours()}:${timeObj.getMinutes()}`

    return `${day}, ${time} ${date}`
}

const generateDate = () => {
    let gapExpire = 10
    let today = new Date()
    let expireDay = moment(today).add(gapExpire, 'd').toDate()
    return {
        today: formatDate(today),
        expireDay: formatDate(expireDay)
    }
}

module.exports = { generateDate }