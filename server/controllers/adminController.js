const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const ContactInquiry = require('../models/ContactInquiry');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const Payment = require('../models/Payment');

/**
 * Generate JWT Token helper
 */
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'qa_fallback_secret_key',
    {
      expiresIn: '24h',
    }
  );
};

/**
 * @desc Admin Login
 * @route POST /api/admin/login
 * @access Public
 */
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Access unauthorized.',
      });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Access unauthorized.',
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin._id);

    return res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error('[Admin Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication.',
      error: error.message,
    });
  }
};

/**
 * @desc Get currently authenticated admin details
 * @route GET /api/admin/me
 * @access Private (Admin)
 */
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      admin: req.admin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching admin profile.',
    });
  }
};

/**
 * @desc Get aggregated dashboard statistics
 * @route GET /api/admin/stats
 * @access Private (Admin)
 */
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalInquiries,
      newCount,
      contactedCount,
      inReviewCount,
      completedCount,
      totalSubscribers,
      recentInquiries,
      serviceDistribution,
    ] = await Promise.all([
      ContactInquiry.countDocuments(),
      ContactInquiry.countDocuments({ status: 'new' }),
      ContactInquiry.countDocuments({ status: 'contacted' }),
      ContactInquiry.countDocuments({ status: 'in_review' }),
      ContactInquiry.countDocuments({ status: 'completed' }),
      NewsletterSubscriber.countDocuments({ status: 'active' }),
      ContactInquiry.find().sort({ createdAt: -1 }).limit(5),
      ContactInquiry.aggregate([
        { $group: { _id: '$service', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    // 7-day trend calculation
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentWeeklyCount = await ContactInquiry.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Payment stats
    const paymentStats = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalPayments: { $sum: 1 },
          paidCount: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'PAID'] }, 1, 0] },
          },
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'PENDING'] }, 1, 0] },
          },
          failedCount: {
            $sum: {
              $cond: [
                { $in: ['$paymentStatus', ['FAILED', 'USER_DROPPED', 'EXPIRED']] },
                1,
                0,
              ],
            },
          },
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', 'PAID'] }, '$amount', 0],
            },
          },
        },
      },
    ]);

    const paymentSummary = paymentStats[0] || {
      totalPayments: 0,
      paidCount: 0,
      pendingCount: 0,
      failedCount: 0,
      totalRevenue: 0,
    };

    return res.status(200).json({
      success: true,
      data: {
        totalInquiries,
        statusCounts: {
          new: newCount,
          contacted: contactedCount,
          in_review: inReviewCount,
          completed: completedCount,
        },
        recentWeeklyCount,
        totalSubscribers,
        recentInquiries,
        serviceDistribution: serviceDistribution.map((item) => ({
          service: item._id || 'Other',
          count: item.count,
        })),
        payments: paymentSummary,
      },
    });
  } catch (error) {
    console.error('[Admin Stats Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to aggregate statistics.',
      error: error.message,
    });
  }
};

/**
 * @desc Get list of payments with filtering, pagination and search
 * @route GET /api/admin/payments
 * @access Private (Admin)
 */
const getAdminPayments = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.paymentStatus = status.toUpperCase();
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { orderId: searchRegex },
        { customerName: searchRegex },
        { customerEmail: searchRegex },
        { customerPhone: searchRegex },
        { cashfreePaymentId: searchRegex },
        { serviceName: searchRegex },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [payments, total, stats] = await Promise.all([
      Payment.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Payment.countDocuments(query),
      Payment.aggregate([
        {
          $group: {
            _id: null,
            totalPayments: { $sum: 1 },
            paidCount: {
              $sum: { $cond: [{ $eq: ['$paymentStatus', 'PAID'] }, 1, 0] },
            },
            pendingCount: {
              $sum: { $cond: [{ $eq: ['$paymentStatus', 'PENDING'] }, 1, 0] },
            },
            failedCount: {
              $sum: {
                $cond: [
                  { $in: ['$paymentStatus', ['FAILED', 'USER_DROPPED', 'EXPIRED']] },
                  1,
                  0,
                ],
              },
            },
            totalRevenue: {
              $sum: {
                $cond: [{ $eq: ['$paymentStatus', 'PAID'] }, '$amount', 0],
              },
            },
          },
        },
      ]),
    ]);

    const summary = stats[0] || {
      totalPayments: 0,
      paidCount: 0,
      pendingCount: 0,
      failedCount: 0,
      totalRevenue: 0,
    };

    return res.status(200).json({
      success: true,
      data: payments,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
      summary,
    });
  } catch (error) {
    console.error('[Admin Payments Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve payments.',
      error: error.message,
    });
  }
};

/**
 * @desc Get single payment by ID
 * @route GET /api/admin/payments/:id
 * @access Private (Admin)
 */
const getAdminPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found.',
      });
    }
    return res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching payment detail.',
      error: error.message,
    });
  }
};

module.exports = {
  loginAdmin,
  getMe,
  getDashboardStats,
  getAdminPayments,
  getAdminPaymentById,
};

