const prisma                   = require('../utils/prisma');
const { uploadBuffer }         = require('../utils/cloudinary');
const { calculateExtraCharge } = require('../utils/pricecalculator');

async function createCustomisation({ textContent, font, color, position, file }) {
  let imageUrl = null;
  if (file) imageUrl = await uploadBuffer(file.buffer, 'customizations');

  const extraCharge = calculateExtraCharge({ textContent, imageUrl });

  const customisation = await prisma.customization.create({
    data: { textContent, imageUrl, font, color, position, extraCharge },
  });

  return { id: customisation.id, extraCharge };
}

module.exports = { createCustomisation };