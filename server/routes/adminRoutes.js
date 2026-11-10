const express = require('express');
const router = express.Router();
const { loginLimiter } = require('../middleware/rateLimiter');
const { protectAdmin } = require('../middleware/auth');
const {
  loginAdmin,
  getMe,
  getDashboardStats,
  getAdminPayments,
  getAdminPaymentById,
} = require('../controllers/adminController');
const {
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
} = require('../controllers/contactController');
const { getSubscribers } = require('../controllers/newsletterController');

// Public route: Admin authentication
router.post('/login', loginLimiter, loginAdmin);

// Protected routes (JWT verification required)
router.use(protectAdmin);

router.get('/me', getMe);
router.get('/stats', getDashboardStats);
router.get('/inquiries', getInquiries);
router.get('/inquiries/:id', getInquiryById);
router.patch('/inquiries/:id', updateInquiryStatus);
router.delete('/inquiries/:id', deleteInquiry);
router.get('/subscribers', getSubscribers);
router.get('/payments', getAdminPayments);
router.get('/payments/:id', getAdminPaymentById);

module.exports = router;

