// Entry point for your serverless function
// Example: a simple verification function

module.exports = async (req, res) => {
  try {
    // Example input
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Example process (replace with your real logic)
    const isVerified = userId === "12345";

    return res.status(200).json({
      userId,
      verified: isVerified,
      message: isVerified ? "User verified successfully." : "User not verified."
    });
  } catch (err) {
    console.error("Function error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
