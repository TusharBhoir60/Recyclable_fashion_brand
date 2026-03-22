/**
 * Customisation surcharge rules
 *   Text only    → +₹100
 *   Image only   → +₹200
 *   Text + image → +₹280
 */
function calculateExtraCharge({ textContent, imageUrl }) {
  const hasText  = Boolean(textContent && textContent.trim());
  const hasImage = Boolean(imageUrl);

  if (hasText && hasImage) return 280;
  if (hasImage)            return 200;
  if (hasText)             return 100;
  return 0;
}

module.exports = { calculateExtraCharge };