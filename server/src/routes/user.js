const express = require('express');
const { verifyToken } = require('../middlewares/verifyToken')
const userControllers = require('../controllers/user');

const router = express.Router();

router.use(verifyToken)
router.get('/get-current', userControllers.getCurrent)
router.put('/', userControllers.updateUser)

module.exports = router;