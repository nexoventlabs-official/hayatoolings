const express = require('express');
const COUNTRIES = require('../utils/countries');

const router = express.Router();

router.get('/countries', (_req, res) => {
  res.json({ data: COUNTRIES });
});

router.get('/config', (_req, res) => {
  res.json({
    data: {
      currencies: ['INR', 'USD', 'EUR'],
      rates: {
        INR: 1,
        USD: parseFloat(process.env.INR_TO_USD || '0.012'),
        EUR: parseFloat(process.env.INR_TO_EUR || '0.011'),
      },
      payglocal: {
        inrPbId: process.env.PAYGLOCAL_INR_PB_ID || '',
        usdPbId: process.env.PAYGLOCAL_USD_PB_ID || '',
        eurPbId: process.env.PAYGLOCAL_EUR_PB_ID || '',
      },
    },
  });
});

module.exports = router;
