const express = require('express');
const router = express.Router();
const { generateSalesReport } = require('../../controllers/dashboard/reportController');

router.post('/report/sales', generateSalesReport);

module.exports = router;
