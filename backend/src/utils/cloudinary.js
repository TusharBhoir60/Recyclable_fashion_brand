const cloudinary = require('cloudinary').v2;
const env = require('../config/env');

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key:    env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

/**
 * Upload a Buffer to Cloudinary.
 * @param {Buffer} buffer
 * @param {string} folder
 * @returns {Promise<string>} secure_url
 */
async function uploadBuffer(buffer, folder = 'recyclabag') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

module.exports = { cloudinary, uploadBuffer };