import fetch from "node-fetch";

export default async ({ req, res }: any) => {
  console.log("Secret key detected:", !!process.env.RECAPTCHA_SECRET_KEY);

  const body = JSON.parse(req.body || "{}");
  const captchaToken = body.captchaToken;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!captchaToken) {
    return res.json({ success: false, message: "Missing CAPTCHA token." });
  }

  try {
    // Verify CAPTCHA with Google
    const verify = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${captchaToken}`,
    });

    const data = await verify.json();

    if (!data.success) {
      console.error("CAPTCHA verification failed:", data);
      return res.json({ success: false, message: "CAPTCHA verification failed." });
    }

    // If verified
    console.log("CAPTCHA verified successfully");
    return res.json({ success: true, message: "CAPTCHA passed" });

  } catch (error: any) {
    console.error("CAPTCHA verification error:", error);
    return res.json({ success: false, message: "Error verifying CAPTCHA." });
  }
};
