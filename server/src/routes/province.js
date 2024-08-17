const express = require('express');
const provinceControllers = require('../controllers/province');

const router = express.Router();

router.get('/all', provinceControllers.getProvinces)

module.exports = router;