// index.js for Amniva-Report (Internal System)
import express from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(bodyParser.json());

// Generate a report from a given prediction
app.post("/report", (req, res) => {
  try {
    const { predictionId, dataSource, method, results, mechanism } = req.body;

    const report = {
      reportId: `rep-${uuidv4()}`,
      predictionId,
      timestamp: new Date().toISOString(),
      dataSource,
      method,
      results,
      mechanism,
      author: "Amniva Internal System"
    };

    // Later: Save report into internal DB (Appwrite/other)
    // For now: Just return the report
    res.status(201).json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Amniva-Report running on port 3000");
});
