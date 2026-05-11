const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

let cachedKey = null;
function getPublicKey() {
  if (cachedKey !== null) return cachedKey;
  try {
    const file = process.env.PAYGLOCAL_PUBLIC_KEY_FILE;
    if (!file) return (cachedKey = '');
    const abs = path.isAbsolute(file) ? file : path.resolve(process.cwd(), file);
    cachedKey = fs.readFileSync(abs, 'utf8');
  } catch (err) {
    console.warn('[payglocal] could not read public key file:', err.message);
    cachedKey = '';
  }
  return cachedKey;
}

/**
 * Best-effort verification of a JWS / JWT string returned by PayGlocal's
 * hosted page. Returns the decoded payload object, or null if no key is
 * configured / the token is invalid.
 *
 * PayGlocal typically signs payloads with RS256.
 */
function verifyToken(token) {
  if (!token) return null;
  const key = getPublicKey();
  if (!key) {
    // No key configured — decode without verification (return as-is).
    try { return jwt.decode(token); } catch (_) { return null; }
  }
  try {
    return jwt.verify(token, key, { algorithms: ['RS256', 'RS512', 'ES256'] });
  } catch (err) {
    console.warn('[payglocal] token verification failed:', err.message);
    return null;
  }
}

/**
 * Verify a detached RSA-SHA256 signature over a raw JSON body.
 * Used as a fallback for PayGlocal endpoints that send the signature in
 * a separate header instead of as a JWS.
 */
function verifyRsaSignature(rawBody, signatureBase64) {
  const key = getPublicKey();
  if (!key || !signatureBase64) return false;
  try {
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(rawBody);
    verify.end();
    return verify.verify(key, Buffer.from(signatureBase64, 'base64'));
  } catch (err) {
    return false;
  }
}

/**
 * Map any of PayGlocal's status strings to our internal enum.
 */
function mapStatus(raw) {
  const s = String(raw || '').toLowerCase();
  if (['success', 'captured', 'settled', 'paid', 'completed', 'approved'].includes(s)) return 'success';
  if (['failed', 'failure', 'declined', 'error', 'rejected'].includes(s)) return 'failed';
  if (['refunded'].includes(s)) return 'refunded';
  if (['cancelled', 'canceled', 'aborted'].includes(s)) return 'cancelled';
  return 'pending';
}

module.exports = { getPublicKey, verifyToken, verifyRsaSignature, mapStatus };
