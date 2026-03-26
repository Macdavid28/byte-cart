import axios from "axios";

// Paystack base URL
const PAYSTACK_BASE_URL = "https://api.paystack.co";

// Paystack secret key from environment variables
const getSecretKey = () => process.env.PAYSTACK_SECRET_KEY;

/**
 * Initialize a Paystack transaction
 * @param {string} email - Customer email
 * @param {number} amount - Amount in kobo (NGN smallest unit)
 * @param {object} metadata - Additional transaction metadata
 * @param {string} callbackUrl - URL to redirect to after payment
 * @returns {object} Paystack initialization response
 */
export const initializeTransaction = async (
  email,
  amount,
  metadata = {},
  callbackUrl,
) => {
  try {
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount, // amount in kobo
        metadata,
        callback_url: callbackUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${getSecretKey()}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to initialize Paystack transaction",
    );
  }
};

/**
 * Verify a Paystack transaction by reference
 * @param {string} reference - Transaction reference
 * @returns {object} Paystack verification response
 */
export const verifyTransaction = async (reference) => {
  try {
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${getSecretKey()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to verify Paystack transaction",
    );
  }
};
