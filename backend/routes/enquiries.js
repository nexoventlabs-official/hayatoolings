const express = require('express');
const Enquiry = require('../models/Enquiry');

const router = express.Router();

// POST /api/enquiries  (public)
router.post('/', async (req, res) => {
  try {
    const { type, name, company, email, phone, country, subject, message } = req.body || {};
    if (!type || !['quote', 'contact'].includes(type)) {
      return res.status(400).json({ error: 'type must be "quote" or "contact"' });
    }
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email and message are required' });
    }
    const enq = await Enquiry.create({ type, name, company, email, phone, country, subject, message });
    res.status(201).json({ data: enq });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
