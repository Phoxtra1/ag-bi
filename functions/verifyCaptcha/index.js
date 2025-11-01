import axios from "axios";

export default async ({ req, res, log, error }) => {
  try {
    const { token } = JSON.parse(req.body);
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!token) {
      return res.json({ success: false, message: "Missing CAPTCHA token" }, 400);
    }

    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );

    const data = response.data;

    if (data.success) {
      return res.json({ success: true, score: data.score || null });
    } else {
      return res.json({
        success: false,
        message: "CAPTCHA verification failed",
        details: data["error-codes"],
      });
    }
  } catch (err) {
    error("❌ CAPTCHA verification error:", err);
    return res.json({ success: false, message: err.message }, 500);
  }
};
