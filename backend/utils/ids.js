const crypto = require('crypto');

function generateOrderId() {
  // ORD-YYMMDD-XXXXX
  const d = new Date();
  const y = String(d.getFullYear()).slice(-2);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `ORD-${y}${m}${day}-${rand}`;
}

function generateTxnId() {
  return `TXN-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
}

module.exports = { generateOrderId, generateTxnId };
