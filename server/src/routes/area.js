const express = require('express');
const areaControllers = require('../controllers/area');

const router = express.Router();

router.get('/all', areaControllers.getAreas)

module.exports = router;