// functions/amniva-trending/index.js

exports.handler = async (req, res) => {
  try {
    // Business-focused trending data (replace with real logic, e.g., DB query, API call)
    const trending = [
      { id: 1, title: "AI transforming financial analytics", category: "Markets" },
      { id: 2, title: "Africa's fintech investment surge", category: "Investment" },
      { id: 3, title: "Global supply chain disruption signals", category: "Trade" },
      { id: 4, title: "Emerging market risk assessment", category: "Risk" },
      { id: 5, title: "Cryptocurrency regulatory developments", category: "Markets" },
      { id: 6, title: "Cross-border trade agreements", category: "Trade" },
      { id: 7, title: "ESG investment trends accelerate", category: "Investment" },
      { id: 8, title: "Geopolitical risk indicators rising", category: "Risk" },
      { id: 9, title: "Central bank policy shifts", category: "Markets" }
    ];

    res.status(200).json({
      success: true,
      data: trending
    });
  } catch (error) {
    console.error("Error in amniva-trending:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
