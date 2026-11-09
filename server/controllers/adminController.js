const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const ContactInquiry = require('../models/ContactInquiry');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');

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

module.exports = {
  loginAdmin,
  getMe,
  getDashboardStats,
};

