const mlService = require("../services/mlservice");

const pricePredict = async (req, res) => {
  try {
    const result = await mlService.getPriceSuggestion(req.body);
    return res.status(200).json(result);
    } catch (err) {
    const status = err?.response?.status || 500;
    return res.status(status).json({
      success: false,
      message:
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "ML price service failed",
    });
    }
};

const getPriceSuggestion = async (payload) => {
  const { data } = await withRetry(() => mlClient.post("/api/price/predict", payload), 1);
  return data;
};

const getDemandForecast = async (payload) => {
  const { data } = await withRetry(() => mlClient.post("/api/demand/forecast", payload), 1);
  return data;
};

module.exports = {
  getPriceSuggestion,
  getDemandForecast,
};