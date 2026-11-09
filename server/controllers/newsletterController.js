const NewsletterSubscriber = require('../models/NewsletterSubscriber');

/**
 * @desc Subscribe to newsletter / financial updates
 * @route POST /api/newsletter/subscribe
 * @access Public
 */
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if already subscribed
    let subscriber = await NewsletterSubscriber.findOne({ email: cleanEmail });

    if (subscriber) {
      if (subscriber.status === 'unsubscribed') {
        subscriber.status = 'active';
        subscriber.subscribedAt = new Date();
        await subscriber.save();
        return res.status(200).json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.',
        });
      }
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to FinXinfo updates.',
      });
    }

    subscriber = await NewsletterSubscriber.create({
      email: cleanEmail,
      status: 'active',
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to FinXinfo financial insights.',
    });
  } catch (error) {
    console.error('[Newsletter Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Subscription failed. Please try again.',
      error: error.message,
    });
  }
};

/**
 * @desc Get all newsletter subscribers
 * @route GET /api/admin/subscribers
 * @access Private (Admin)
 */
const getSubscribers = async (req, res) => {
  try {
    const subscribers = await NewsletterSubscriber.find()
      .sort({ subscribedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: subscribers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve subscribers.',
      error: error.message,
    });
  }
};

module.exports = {
  subscribe,
  getSubscribers,
};

