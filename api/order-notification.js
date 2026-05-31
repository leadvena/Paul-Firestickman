// Setup strong static security headers manually for the serverless response
function setSecurityHeaders(res) {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Content-Security-Policy", "default-src 'self' https:;");
}

// Simple in-memory rate limiter for serverless environment nodes
const trackerLimits = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 mins
const MAX_REQ_PER_WINDOW = 5;

// Strict string sanitizer
const sanitizeHTML = (text, maxLength = 800) => {
  if (typeof text !== "string") return "";
  return text
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .substring(0, maxLength);
};

export default async function handler(req, res) {
  setSecurityHeaders(res);

  // Only allow POST actions
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed. Use POST." });
  }

  try {
    // 1. IP Rate Limiting
    const clientIp = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
    const now = Date.now();
    let timestamps = trackerLimits.get(clientIp) || [];
    timestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);

    if (timestamps.length >= MAX_REQ_PER_WINDOW) {
      console.warn(`🛑 Serverless rate limit triggered for client ${clientIp}`);
      return res.status(429).json({
        success: false,
        error: "Rate limit exceeded. Please wait a few minutes before submitting another order request.",
      });
    }

    timestamps.push(now);
    trackerLimits.set(clientIp, timestamps);

    // 2. Extract and sanitize inputs to defend against HTML email client XSS injections
    const fullName = sanitizeHTML(req.body.fullName, 120);
    const email = sanitizeHTML(req.body.email, 150);
    const phone = sanitizeHTML(req.body.phone, 50);
    const streetAddress = sanitizeHTML(req.body.streetAddress, 250);
    const city = sanitizeHTML(req.body.city, 120);
    const postcode = sanitizeHTML(req.body.postcode, 30);
    const packageType = sanitizeHTML(req.body.packageType, 200);
    const specialInstructions = sanitizeHTML(req.body.specialInstructions, 1500);

    // 3. Strict validations
    if (!fullName || !email || !phone || !packageType) {
      return res.status(400).json({
        success: false,
        error: "Required fields are empty or invalid. Please check your submission data.",
      });
    }

    // Structure validation for email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({
        success: false,
        error: "The email address supplied is formatted incorrectly.",
      });
    }

    const resendKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;

    // Simulated log fallback if keys are missing
    if (!resendKey || !adminEmail) {
      console.warn("⚠️ API Notification Setup: RESEND_API_KEY or ADMIN_EMAIL is not configured yet on Vercel.");
      return res.status(200).json({
        success: true,
        status: "simulated",
        message: "RESEND_API_KEY or ADMIN_EMAIL environment variable is missing on Vercel. Setup those vars in Vercel settings to dispatch real emails!",
      });
    }

    // Beautiful HTML formatting for Resend email dispatch
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 12px; padding: 24px; background-color: #fafafa;">
        <div style="text-align: center; border-bottom: 2px solid #FF6B00; padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="color: #0a0a0a; margin: 0; font-size: 24px;">PaulFirestickMan</h1>
          <p style="color: #FF6B00; font-weight: bold; margin: 4px 0 0 0; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">New Web Order Notification</p>
        </div>
        
        <p style="font-size: 15px; color: #333;">Hi Paul, you've received a fresh order request from your website!</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;">
          <tr style="background-color: #f0f0f0;">
            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd; width: 40%;">Field</th>
            <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Details</th>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Full Name</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Phone Number</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="tel:${phone}">${phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Address</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${streetAddress || ""}<br>${city || ""}<br>${postcode || ""}</td>
          </tr>
          <tr style="background-color: #fff8f5;">
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #FF6B00;">Package Chosen</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #FF6B00;">${packageType}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Instructions / Notes</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-style: italic;">${specialInstructions || "None"}</td>
          </tr>
        </table>

        <div style="margin-top: 32px; text-align: center;">
          <a href="https://www.facebook.com/messages/e2ee/t/5166288536929927" target="_blank" style="background-color: #006aff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-block;">
            Open Facebook Messenger Chat
          </a>
        </div>

        <div style="border-top: 1px solid #eee; margin-top: 32px; padding-top: 16px; font-size: 11px; color: #a0a0a0; text-align: center;">
          This dispatch was generated from your web store on PaulFirestickMan.
        </div>
      </div>
    `;

    // Handshake and fetch to Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: "PaulFirestickMan Web Store <onboarding@resend.dev>",
        to: adminEmail,
        subject: `🔥 New Order from ${fullName} (${packageType})`,
        html: emailHtml,
      }),
    });

    const resData = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", resData);
      return res.status(502).json({
        success: false,
        error: "Resend API error",
        details: resData?.message || "Check your Resend credential values keys.",
      });
    }

    return res.status(200).json({
      success: true,
      status: "delivered",
      id: resData?.id,
    });
  } catch (err) {
    console.error("Server API exception details:", err);
    return res.status(500).json({
      success: false,
      error: "Internal failure dispatching serverless email",
      message: err.message,
    });
  }
}
