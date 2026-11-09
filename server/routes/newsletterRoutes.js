const express = require('express');
const router = express.Router();
const { generalLimiter } = require('../middleware/rateLimiter');
const { subscribe } = require('../controllers/newsletterController');

router.post('/subscribe', generalLimiter, subscribe);

module.exports = router;

