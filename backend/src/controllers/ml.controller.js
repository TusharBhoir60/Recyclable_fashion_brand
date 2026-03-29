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

const demandForecast = async (req, res) => {
  try {
    const result = await mlService.getDemandForecast(req.body);
    return res.status(200).json(result);
  } catch (err) {
    const status = err?.response?.status || 500;
    return res.status(status).json({
      success: false,
      message:
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "ML demand service failed",
    });
  }
};

module.exports = {
  pricePredict,
  demandForecast,
};