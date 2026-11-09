const ContactInquiry = require('../models/ContactInquiry');
const {
  sendAdminNotification,
  sendCustomerConfirmation,
} = require('../services/emailService');

// Generate unique inquiry ID e.g. QA-2025-7K8P9
const generateInquiryId = () => {
  const year = new Date().getFullYear();
  const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `QA-${year}-${randomChars}`;
};

/**
 * @desc Submit a new contact / consultation request
 * @route POST /api/contact
 * @access Public
 */
const createInquiry = async (req, res) => {
  try {
    const { name, email, phone, company, service, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !service || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: Name, Email, Phone, Service, and Message.',
      });
    }

    // Check for recent duplicate submission from same email within last 2 minutes
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const existingRecent = await ContactInquiry.findOne({
      email: email.toLowerCase().trim(),
      createdAt: { $gte: twoMinutesAgo },
    });

    if (existingRecent) {
      return res.status(429).json({
        success: false,
        message: 'A consultation request was recently submitted with this email. Please allow our team a few minutes to respond.',
        inquiryId: existingRecent.inquiryId,
      });
    }

    // Create unique inquiry ID
    let inquiryId = generateInquiryId();
    // Ensure uniqueness
    let exists = await ContactInquiry.findOne({ inquiryId });
    while (exists) {
      inquiryId = generateInquiryId();
      exists = await ContactInquiry.findOne({ inquiryId });
    }

    const inquiry = await ContactInquiry.create({
      inquiryId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      company: company ? company.trim() : '',
      service: service.trim(),
      message: message.trim(),
      status: 'new',
    });

    // Send emails asynchronously without blocking response
    Promise.all([
      sendAdminNotification(inquiry),
      sendCustomerConfirmation(inquiry),
    ]).catch((err) =>
      console.error('[Email Worker] Async email delivery error:', err.message)
    );

    return res.status(201).json({
      success: true,
      message: 'Your consultation request has been received. A Certified ProAdvisor will contact you shortly.',
      data: {
        inquiryId: inquiry.inquiryId,
        name: inquiry.name,
        service: inquiry.service,
        createdAt: inquiry.createdAt,
      },
    });
  } catch (error) {
    console.error('[Contact Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred while processing your request. Please try again or call +1-888-843-3173.',
      error: error.message,
    });
  }
};

/**
 * @desc Get all inquiries (with pagination, search, status filter)
 * @route GET /api/admin/inquiries
 * @access Private (Admin)
 */
const getInquiries = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { inquiryId: searchRegex },
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { company: searchRegex },
        { service: searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [inquiries, totalCount] = await Promise.all([
      ContactInquiry.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      ContactInquiry.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: inquiries,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum),
      },
    });
  } catch (error) {
    console.error('[Admin Get Inquiries Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch inquiries.',
      error: error.message,
    });
  }
};

/**
 * @desc Get single inquiry details
 * @route GET /api/admin/inquiries/:id
 * @access Private (Admin)
 */
const getInquiryById = async (req, res) => {
  try {
    const inquiry = await ContactInquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error retrieving inquiry.',
      error: error.message,
    });
  }
};

/**
 * @desc Update inquiry status and internal notes
 * @route PATCH /api/admin/inquiries/:id
 * @access Private (Admin)
 */
const updateInquiryStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const allowedStatuses = ['new', 'contacted', 'in_review', 'completed', 'archived'];

    const updateFields = {};
    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`,
        });
      }
      updateFields.status = status;
    }

    if (typeof notes === 'string') {
      updateFields.notes = notes;
    }

    const inquiry = await ContactInquiry.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Inquiry updated successfully.',
      data: inquiry,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating inquiry.',
      error: error.message,
    });
  }
};

/**
 * @desc Delete an inquiry
 * @route DELETE /api/admin/inquiries/:id
 * @access Private (Admin)
 */
const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await ContactInquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: `Inquiry ${inquiry.inquiryId} has been deleted.`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting inquiry.',
      error: error.message,
    });
  }
};

module.exports = {
  createInquiry,
  getInquiries,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry,
};

