// functions/amniva-trending/index.js

exports.handler = async (req, res) => {
  try {
    // Example trending data (replace with your real logic, e.g., DB query, API call)
    const trending = [
      { id: 1, title: "AI reshaping journalism", category: "Technology" },
      { id: 2, title: "Africa’s fintech boom", category: "Business" },
      { id: 3, title: "Elections and digital media", category: "Politics" }
      { id: 4, title: "Entertainment and spotlite", category: "Entertainment" }
      { id: 5, title: "Lifestyle and fashion", category: "Lifestlye" }
      { id: 6, title: "Science and space", category: "Science" }
      { id: 3, title: "History and Culture", category: "Histroy" }
      { id: 3, title: "Kingdoms and ashantis", category: "Kingdoms" }
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
