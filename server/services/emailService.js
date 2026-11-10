const nodemailer = require('nodemailer');

let transporter = null;

// Initialize or create transporter
const getTransporter = async () => {
  if (transporter) return transporter;

  const hasSmtpConfig =
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASSWORD &&
    process.env.EMAIL_USER !== '';

  if (hasSmtpConfig) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else {
    // Development fallback mock transporter
    transporter = {
      sendMail: async (mailOptions) => {
        console.log('\n================== [EMAIL DISPATCHED] ==================');
        console.log(`To: ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`From: ${mailOptions.from}`);
        console.log('Preview Text:');
        console.log(mailOptions.text ? mailOptions.text.slice(0, 300) : 'HTML content');
        console.log('========================================================\n');
        return { messageId: `mock-${Date.now()}@quickadvisorusa.com` };
      },
    };
  }
  return transporter;
};

/**
 * Send notification to Business Admin
 */
const sendAdminNotification = async (inquiry) => {
  try {
    const transport = await getTransporter();
    const adminEmail = process.env.ADMIN_EMAIL || 'contact@finxinfo.com';
    const fromAddress =
      process.env.EMAIL_FROM || 'FinXinfo <noreply@finxinfo.com>';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0A2342; padding: 24px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px; letter-spacing: 0.5px;">FinXinfo</h1>
          <p style="margin: 6px 0 0; font-size: 13px; color: #94A3B8;">New Financial Consultation Request</p>
        </div>
        <div style="padding: 28px; background-color: #FFFFFF; color: #172B45;">
          <div style="background-color: #F8FAFC; border-left: 4px solid #C62835; padding: 12px 16px; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 14px; font-weight: bold; color: #0A2342;">Inquiry ID: <span style="font-family: monospace;">${inquiry.inquiryId}</span></p>
            <p style="margin: 4px 0 0; font-size: 12px; color: #64748B;">Received: ${new Date(inquiry.createdAt || Date.now()).toLocaleString('en-US', { timeZone: 'America/New_York' })} EST</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.6;">
            <tr>
              <td style="padding: 8px 0; color: #64748B; width: 140px; font-weight: 600;">Client Name:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #0A2342;">${inquiry.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748B; font-weight: 600;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${inquiry.email}" style="color: #0A2342;">${inquiry.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748B; font-weight: 600;">Phone:</td>
              <td style="padding: 8px 0;"><a href="tel:${inquiry.phone}" style="color: #0A2342;">${inquiry.phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748B; font-weight: 600;">Company:</td>
              <td style="padding: 8px 0; color: #172B45;">${inquiry.company || 'Not Provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748B; font-weight: 600;">Requested Service:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #C62835;">${inquiry.service}</td>
            </tr>
          </table>

          <div style="margin-top: 20px; padding: 16px; background-color: #F1F5F9; border-radius: 6px;">
            <p style="margin: 0 0 8px; font-weight: bold; color: #0A2342; font-size: 13px; text-transform: uppercase;">Message / Financial Background:</p>
            <p style="margin: 0; font-size: 14px; color: #334155; white-space: pre-wrap;">${inquiry.message}</p>
          </div>

          <div style="margin-top: 28px; text-align: center;">
            <a href="${(process.env.CLIENT_URL || '').replace(/\/+$/, '') || 'https://finxinfo.com'}/admin/inquiries" style="display: inline-block; background-color: #0A2342; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: bold;">Review In Admin Dashboard</a>
          </div>
        </div>
        <div style="background-color: #F8FAFC; padding: 16px; text-align: center; font-size: 12px; color: #94A3B8; border-top: 1px solid #E2E8F0;">
          FinXinfo Financial Services &bull; 220 S Livermore Ave, #3250, Livermore, CA 94550
        </div>
      </div>
    `;

    await transport.sendMail({
      from: fromAddress,
      to: adminEmail,
      subject: `[New Inquiry] ${inquiry.service} - ${inquiry.name} (${inquiry.inquiryId})`,
      text: `New consultation request from ${inquiry.name} (${inquiry.email}, ${inquiry.phone}) for ${inquiry.service}.\n\nMessage:\n${inquiry.message}`,
      html,
    });
  } catch (err) {
    console.error('[Email Error] Failed to send admin notification:', err.message);
  }
};

/**
 * Send confirmation email to Customer
 */
const sendCustomerConfirmation = async (inquiry) => {
  try {
    const transport = await getTransporter();
    const fromAddress =
      process.env.EMAIL_FROM || 'FinXinfo <noreply@finxinfo.com>';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0A2342; padding: 28px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 26px; letter-spacing: 0.5px;">FinXinfo</h1>
          <p style="margin: 8px 0 0; font-size: 14px; color: #94A3B8;">Certified QuickBooks ProAdvisors &bull; Licensed CPA Partner</p>
        </div>
        <div style="padding: 32px; background-color: #FFFFFF; color: #172B45;">
          <h2 style="margin: 0 0 16px; font-size: 20px; color: #0A2342;">Thank You for Reaching Out, ${inquiry.name}!</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 20px;">
            We have received your consultation request regarding <strong>${inquiry.service}</strong>. One of our dedicated Certified QuickBooks ProAdvisors will review your business requirements and contact you within one business day.
          </p>

          <div style="background-color: #F8FAFC; border-left: 4px solid #0A2342; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
            <p style="margin: 0 0 6px; font-size: 13px; font-weight: bold; color: #0A2342;">Consultation Reference Code:</p>
            <p style="margin: 0; font-size: 18px; font-family: monospace; font-weight: bold; color: #C62835;">${inquiry.inquiryId}</p>
          </div>

          <h3 style="margin: 20px 0 12px; font-size: 16px; color: #0A2342;">What Happens Next?</h3>
          <ol style="font-size: 14px; line-height: 1.7; color: #475569; padding-left: 20px; margin-bottom: 24px;">
            <li><strong>Initial Account Assessment:</strong> We evaluate your QuickBooks setup, ledger volume, or CPA tax filing requirements.</li>
            <li><strong>Free Strategy Call:</strong> A 15-minute consultation with a senior ProAdvisor to outline transparent pricing and scope.</li>
            <li><strong>Action Plan:</strong> Custom monthly bookkeeping workflow or clean-up schedule tailored to your business.</li>
          </ol>

          <div style="background-color: #EFF6FF; border: 1px solid #BFDBFE; padding: 16px; border-radius: 6px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #1E3A8A; font-weight: 500;">Need immediate assistance during business hours?</p>
            <p style="margin: 6px 0 0; font-size: 16px; font-weight: bold; color: #0A2342;">Call Toll-Free: <a href="tel:+18888433173" style="color: #C62835; text-decoration: none;">+1-888-843-3173</a></p>
          </div>
        </div>
        <div style="background-color: #0A2342; padding: 20px; text-align: center; font-size: 12px; color: #94A3B8;">
          <p style="margin: 0 0 4px; color: #FFFFFF; font-weight: 600;">FinXinfo</p>
          <p style="margin: 0 0 4px;">220 S Livermore Ave, #3250, Livermore, CA 94550 &bull; contact@finxinfo.com</p>
          <p style="margin: 0; font-size: 11px; color: #64748B;">Hours: Monday &ndash; Friday, 8:00 AM &ndash; 7:00 PM EST</p>
        </div>
      </div>
    `;

    await transport.sendMail({
      from: fromAddress,
      to: inquiry.email,
      subject: `We've received your request - FinXinfo (Ref: ${inquiry.inquiryId})`,
      text: `Hello ${inquiry.name},\n\nThank you for contacting FinXinfo regarding ${inquiry.service}. Your reference number is ${inquiry.inquiryId}.\n\nOur team of Certified QuickBooks ProAdvisors will reach out to you within one business day.\n\nBest regards,\nFinXinfo Team\n+1-888-843-3173`,
      html,
    });
  } catch (err) {
    console.error('[Email Error] Failed to send customer confirmation:', err.message);
  }
};

module.exports = {
  sendAdminNotification,
  sendCustomerConfirmation,
};

