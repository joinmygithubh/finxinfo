const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Public Payment endpoints
router.get('/catalog', paymentController.getPlansCatalog);
router.post('/create-order', paymentController.createPaymentOrder);
router.get('/verify/:orderId', paymentController.verifyPayment);
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;

