const express = require('express');
const controllers = require('../controllers/category');

const router = express.Router();

router.get('/all', controllers.getCategories)

module.exports = router;
