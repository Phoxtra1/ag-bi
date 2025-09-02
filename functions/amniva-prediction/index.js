// index.js
// Amniva Internal Prediction System
// Strictly for internal use with Amniva API

const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

// Internal API Base URL
const AMNIVA_API_URL = process.env.AMNIVA_API_URL || "http://localhost:5000/api"; 

// Health Check
app.get("/", (req, res) => {
  res.json({ 
    status: "Amniva Prediction System Running",
    internalAPI: AMNIVA_API_URL 
  });
});

// Get Prediction from Internal API
app.post("/predict", async (req, res) => {
  try {
    const inputData = req.body;

    const response = await fetch(`${AMNIVA_API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputData),
    });

    if (!response.ok) {
      throw new Error(`Internal API error: ${response.statusText}`);
    }

    const prediction = await response.json();
    res.json({ success: true, prediction });

  } catch (error) {
    console.error("Prediction Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Server Listener
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Amniva Prediction System running on port ${PORT}`);
});
