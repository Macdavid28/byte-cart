import { transactionalEmailsApi, sender } from "./brevo.config.js";
import {
  verificationEmailTemplate,
  resetPasswordTemplate,
  resetSuccessTemplate,
  welcomeEmailTemplate,
  orderConfirmationTemplate,
  shippingUpdateTemplate,
} from "./emailTemplates.js";

// Send verification email
// Send verification email
export const sendVerificationEmail = async (name, email, verificationToken) => {
  try {
    const emailData = {
      subject: "Verify Your Email",
      htmlContent: verificationEmailTemplate(name, verificationToken),
      sender: sender,
      to: [{ email: email }],
    };

    const data = await transactionalEmailsApi.sendTransacEmail(emailData);
    console.log("Verification email sent:", data);
  } catch (err) {
    console.error("Verification email error:", err);
    throw err;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
  try {
    const emailData = {
      subject: "Welcome to Our Platform!",
      htmlContent: welcomeEmailTemplate(name),
      sender: sender,
      to: [{ email: email }],
    };

    const data = await transactionalEmailsApi.sendTransacEmail(emailData);
    console.log("Welcome email sent:", data);
  } catch (err) {
    console.error("Welcome email error:", err);
    throw err;
  }
};

export const sendPasswordResetEmail = async (email, otp) => {
  try {
    const emailData = {
      subject: "Your Password Reset Code",
      htmlContent: resetPasswordTemplate(otp),
      sender: sender,
      to: [{ email: email }],
    };

    const data = await transactionalEmailsApi.sendTransacEmail(emailData);
    console.log("Password reset email sent:", data);
  } catch (err) {
    console.error("Password reset email error:", err);
    throw err;
  }
};

// Send password reset success email
export const sendResetSuccessEmail = async (email) => {
  try {
    const emailData = {
      subject: "Your Password Has Been Reset",
      htmlContent: resetSuccessTemplate(),
      sender: sender,
      to: [{ email: email }],
    };

    const data = await transactionalEmailsApi.sendTransacEmail(emailData);
    console.log("Password reset success email sent:", data);
  } catch (err) {
    console.error("Reset success email error:", err);
    throw err;
  }
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (email, name, orderNumber, total) => {
  try {
    const emailData = {
      subject: `Order Confirmed - ${orderNumber}`,
      htmlContent: orderConfirmationTemplate(name, orderNumber, total),
      sender: sender,
      to: [{ email: email }],
    };

    const data = await transactionalEmailsApi.sendTransacEmail(emailData);
    console.log("Order confirmation email sent:", data);
  } catch (err) {
    console.error("Order confirmation email error:", err);
    throw err;
  }
};

// Send shipping update email
export const sendShippingUpdateEmail = async (email, name, orderNumber, trackingNumber) => {
  try {
    const emailData = {
      subject: `Your Order ${orderNumber} Has Shipped!`,
      htmlContent: shippingUpdateTemplate(name, orderNumber, trackingNumber),
      sender: sender,
      to: [{ email: email }],
    };

    const data = await transactionalEmailsApi.sendTransacEmail(emailData);
    console.log("Shipping update email sent:", data);
  } catch (err) {
    console.error("Shipping update email error:", err);
    throw err;
  }
};

//contact email

export const contactEmail = async (email) => {};
