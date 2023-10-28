const crypto = require('crypto');

function encrypt (data, secret) {
  const iv = crypto.randomBytes(16);
  const ivh = iv.toString('hex');
  const cipher = crypto.createCipheriv('aes-256-gcm', secret, iv);
  const encrypted = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  const encryptedWithMeta = [authTag, ivh, encrypted].join('|');
  const encoded = Buffer.from(encryptedWithMeta).toString('base64');
  return encoded;
}

function decrypt (data, secret) {
  const decoded = Buffer.from(data, 'base64').toString('utf8');
  const [authTag, ivh, encrypted] = decoded.split('|');
  const iv = Buffer.from(ivh, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-gcm', secret, iv);
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  const decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
  return decrypted;
}

function randomHash (size) {
  // Generate a random token using crypto module
  const token = crypto.randomBytes(size).toString('hex');
  // Hash the token for security
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return hash;
}

module.exports = {
  encrypt,
  decrypt,
  randomHash
};
