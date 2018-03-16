const express = require('express');
const router = express.Router();

const salesCtrl = require('../controller/salesController');

router.get('/record/check',salesController.getSales);

module.exports = router;