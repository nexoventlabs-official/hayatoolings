import React, { useState } from 'react';
import { Send, FileText, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';
import './FormPages.css';

const QuoteRequest = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', message: '' });

  const handleField = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.submitEnquiry({ type: 'quote', ...form });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Could not submit your request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-page section">
      <div className="container">
        <div className="form-header text-center mb-8 animate-fade-in">
          <h1 className="h2 mb-4">Request a <span className="text-accent">Quote</span></h1>
          <p className="text-secondary max-w-2xl mx-auto">
            Need bulk quantities or specific industrial tools? Fill out the form below and our sales team will get back to you with competitive pricing.
          </p>
        </div>

        <div className="form-container glass animate-fade-in delay-100">
          {submitted ? (
            <div className="success-message text-center py-12">
              <div className="success-icon mb-4"><Send size={48} className="text-accent mx-auto" /></div>
              <h3 className="h3 mb-2">Quote Request Sent!</h3>
              <p className="text-secondary">We will contact you shortly with your customized quote.</p>
              <button className="btn btn-outline mt-6" onClick={() => setSubmitted(false)}>Submit Another Request</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="quote-form">
              {error && (
                <div className="checkout-error" style={{ marginBottom: '1rem' }}>
                  <AlertCircle size={18} /> <span>{error}</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <input type="text" className="input-field" required placeholder="John Doe" value={form.name} onChange={handleField('name')} />
                </div>
                <div className="input-group">
                  <label className="input-label">Company Name</label>
                  <input type="text" className="input-field" placeholder="Acme Corp" value={form.company} onChange={handleField('company')} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  <input type="email" className="input-field" required placeholder="john@example.com" value={form.email} onChange={handleField('email')} />
                </div>
                <div className="input-group">
                  <label className="input-label">Phone Number</label>
                  <input type="tel" className="input-field" required placeholder="+91 00000 00000" value={form.phone} onChange={handleField('phone')} />
                </div>
              </div>

              <div className="input-group mb-6">
                <label className="input-label">Required Items & Quantities</label>
                <textarea className="input-field" rows="5" required placeholder="e.g. 10x 16MM CARBIDE BORING BAR..." value={form.message} onChange={handleField('message')}></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-full justify-center" disabled={submitting}>
                <FileText size={18} /> {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteRequest;
