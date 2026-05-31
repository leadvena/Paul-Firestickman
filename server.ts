import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dns from "dns";

// Fix Node.js DNS resolution issues on some local machines / containers
dns.setDefaultResultOrder("ipv4first");

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add strong security headers to protect against common web attacks/vulnerabilities
  app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "DENY"); // Mitigate clickjacking of application pages
    res.setHeader("X-Content-Type-Options", "nosniff"); // Mitigate MIME-sniffing
    res.setHeader("X-XSS-Protection", "1; mode=block"); // Prompt browser to block reflected XSS
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin"); // Safely pass referrers
    res.setHeader("Content-Security-Policy", "default-src 'self' https: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https:;"); // Secure Content Security Policy
    res.removeHeader("X-Powered-By"); // Remove header describing running technology node to limit reconnaissance
    next();
  });

  // Limit JSON body size to prevent Buffer / Memory allocation exhaustion DOS vectors
  app.use(express.json({ limit: "15kb" }));

  // Pure server-side in-memory rate limiting mechanism to block API flood & quota exhaustion
  const trackerLimits = new Map<string, number[]>();
  const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes window
  const MAX_REQ_PER_WINDOW = 5; // Allow a maximum of 5 submissions per IP every 15 minutes

  // Helper function to validate and sanitize form field inputs (defends against embedded scripts running in recipient email clients)
  const sanitizeHTML = (text: any, maxLength = 800): string => {
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

  // Backend API route for order email notifications
  app.post("/api/order-notification", async (req, res) => {
    try {
      // 1. IP Rate Limiting Check
      const clientIp = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown") as string;
      const now = Date.now();
      
      let timestamps = trackerLimits.get(clientIp) || [];
      // Filter out timestamps older than the rate limit window
      timestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
      
      if (timestamps.length >= MAX_REQ_PER_WINDOW) {
        console.warn(`🛑 Rate limit triggered for IP address ${clientIp}`);
        return res.status(429).json({
          success: false,
          error: "Rate limit exceeded. Please wait a few minutes before submitting another order request.",
        });
      }
      
      // Update and save the timestamps array
      timestamps.push(now);
      trackerLimits.set(clientIp, timestamps);

      // 2. Extract and Sanitize Fields (ensures no unescaped strings flow downstream)
      const fullName = sanitizeHTML(req.body.fullName, 120);
      const email = sanitizeHTML(req.body.email, 150);
      const phone = sanitizeHTML(req.body.phone, 50);
      const streetAddress = sanitizeHTML(req.body.streetAddress, 250);
      const city = sanitizeHTML(req.body.city, 120);
      const postcode = sanitizeHTML(req.body.postcode, 30);
      const packageType = sanitizeHTML(req.body.packageType, 200);
      const specialInstructions = sanitizeHTML(req.body.specialInstructions, 1500);

      // 3. Strict Parameter Constraints & Field Validation checks
      if (!fullName || !email || !phone || !packageType) {
        return res.status(400).json({
          success: false,
          error: "Required fields are empty or invalid. Please check your submission data.",
        });
      }

      // Basic structure validation for email addresses to block format abuses
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        return res.status(400).json({
          success: false,
          error: "The email address supplied is formatted incorrectly.",
        });
      }

      const resendKey = process.env.RESEND_API_KEY;
      const adminEmail = process.env.ADMIN_EMAIL;

      const orderSummaryText = `
New Order Received!

--- CUSTOMER INFORMATION ---
Name: ${fullName}
Email: ${email}
Phone: ${phone}

--- SHIPPING ADDRESS ---
Street: ${streetAddress || "Not Provided"}
City: ${city || "Not Provided"}
Postcode: ${postcode || "Not Provided"}

--- SELECTION ---
Package Ordered: ${packageType}

--- SPECIAL INSTRUCTIONS ---
${specialInstructions || "None"}
      `;

      // If configuration keys are missing, return simulated success with warning
      if (!resendKey || !adminEmail) {
        console.warn(
          "⚠️ Email Service: RESEND_API_KEY or ADMIN_EMAIL is not configured yet. Simulating transaction notification success."
        );
        console.log("Simulated Email Content:", orderSummaryText);
        return res.json({
          success: true,
          status: "simulated",
          message: "Resend api key or admin email is not set up on AI Studio yet. The order was successfully recorded in server logs!",
        });
      }

      // Construct a clean HTML body for the email notification
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

      // Dispatch request to Resend API endpoint
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

      const resData = await response.json() as any;

      if (!response.ok) {
        console.error("Resend API error:", resData);
        return res.status(502).json({
          success: false,
          error: "Resend API error",
          details: resData?.message || "Check your credentials.",
        });
      }

      return res.json({
        success: true,
        status: "delivered",
        id: resData?.id,
      });

    } catch (err: any) {
      console.error("Server exception sending order notification:", err);
      return res.status(500).json({
        success: false,
        error: "Internal server error dispatching email notification.",
        message: err.message,
      });
    }
  });

  // Vite middleware setup for Development & Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static frontend assets from standard dist
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 PaulFirestickMan full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
