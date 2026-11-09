const express = require('express');
const router = express.Router();
const { contactLimiter } = require('../middleware/rateLimiter');
const { createInquiry } = require('../controllers/contactController');

// POST /api/contact - Create a new consultation inquiry with rate limiting
router.post('/', contactLimiter, createInquiry);

module.exports = router;

