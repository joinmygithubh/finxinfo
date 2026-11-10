import { load } from '@cashfreepayments/cashfree-js';

let cashfreeInstance = null;

/**
 * Get or initialize the official Cashfree JS SDK instance
 * @param {string} mode - 'sandbox' or 'production'
 * @returns {Promise<any>}
 */
export const getCashfree = async (mode = 'sandbox') => {
  if (!cashfreeInstance) {
    cashfreeInstance = await load({
      mode: mode.toLowerCase() === 'production' ? 'production' : 'sandbox',
    });
  }
  return cashfreeInstance;
};

/**
 * Trigger Cashfree Hosted Checkout
 * @param {string} paymentSessionId - Session ID returned by backend create-order API
 * @param {string} mode - 'sandbox' or 'production'
 * @param {string} redirectTarget - '_self' for hosted redirect or '_modal' for drop-in modal
 */
export const triggerCashfreeCheckout = async (
  paymentSessionId,
  mode = 'sandbox',
  redirectTarget = '_self'
) => {
  if (!paymentSessionId) {
    throw new Error('Payment session ID is required to initiate Cashfree checkout.');
  }

  const cashfree = await getCashfree(mode);

  return cashfree.checkout({
    paymentSessionId,
    redirectTarget, // '_self' opens Cashfree Hosted Checkout page and returns to FinXinfo
  });
};

