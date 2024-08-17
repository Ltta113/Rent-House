const express = require('express');
const priceControllers = require('../controllers/price');

const router = express.Router();

router.get('/all', priceControllers.getPrices)

module.exports = router;