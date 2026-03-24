const customisationService = require('../services/customization.service');

async function createCustomisation(req, res, next) {
  try {
    const { textContent, font, color, position } = req.body;
    const file   = req.file || null;
    const result = await customisationService.createCustomisation({ textContent, font, color, position, file });
    res.status(201).json(result);
  } catch (err) { next(err); }
}

module.exports = { createCustomisation };
