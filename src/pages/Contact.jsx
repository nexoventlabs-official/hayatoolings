import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, AlertCircle } from 'lucide-react';
import { api } from '../lib/api';
import './FormPages.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleField = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.submitEnquiry({ type: 'contact', ...form });
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err.message || 'Could not send your message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-page section">
      <div className="container">
        <div className="form-header text-center mb-8 animate-fade-in">
          <h1 className="h2 mb-4">Get in <span className="text-accent">Touch</span></h1>
          <p className="text-secondary max-w-2xl mx-auto">
            Have questions about our tools or need support? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 contact-grid">
          <div className="contact-info glass p-8 rounded-xl animate-fade-in delay-100">
            <h3 className="h3 mb-6">Contact Information</h3>
            
            <div className="info-item">
              <div className="icon-box"><Phone className="text-accent" /></div>
              <div>
                <h4 className="font-semibold">Phone</h4>
                <p className="text-secondary"><a href="tel:+918680085737">+91 8680085737</a></p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="icon-box"><Mail className="text-accent" /></div>
              <div>
                <h4 className="font-semibold">Email</h4>
                <p className="text-secondary"><a href="mailto:hayatoolings@gmail.com">hayatoolings@gmail.com</a></p>
              </div>
            </div>
            
            <div className="info-item">
              <div className="icon-box"><MapPin className="text-accent" /></div>
              <div>
                <h4 className="font-semibold">Location</h4>
                <p className="text-secondary">26N, Bharathi Nagar, Near Palayapudur, Periyanaickenpalayam, Coimbatore, Tamil Nadu - 641020</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-box"><Clock className="text-accent" /></div>
              <div>
                <h4 className="font-semibold">Business Hours</h4>
                <p className="text-secondary">Mon-Sat: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

          <div className="contact-info glass p-8 rounded-xl animate-fade-in delay-200">
            <h3 className="h3 mb-6">Send us a Message</h3>
            {submitted ? (
              <div className="success-message text-center py-6">
                <div className="success-icon mb-3"><Send size={40} className="text-accent mx-auto" /></div>
                <h4 className="font-semibold mb-2">Message sent!</h4>
                <p className="text-secondary">We will get back to you shortly.</p>
                <button className="btn btn-outline mt-4" onClick={() => setSubmitted(false)}>Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="checkout-error" style={{ marginBottom: '1rem' }}>
                    <AlertCircle size={18} /> <span>{error}</span>
                  </div>
                )}
                <div className="input-group">
                  <label className="input-label">Name</label>
                  <input className="input-field" required value={form.name} onChange={handleField('name')} />
                </div>
                <div className="input-group">
                  <label className="input-label">Email</label>
                  <input type="email" className="input-field" required value={form.email} onChange={handleField('email')} />
                </div>
                <div className="input-group">
                  <label className="input-label">Phone</label>
                  <input type="tel" className="input-field" value={form.phone} onChange={handleField('phone')} />
                </div>
                <div className="input-group">
                  <label className="input-label">Subject</label>
                  <input className="input-field" value={form.subject} onChange={handleField('subject')} />
                </div>
                <div className="input-group">
                  <label className="input-label">Message</label>
                  <textarea className="input-field" rows={4} required value={form.message} onChange={handleField('message')} />
                </div>
                <button type="submit" className="btn btn-primary w-full justify-center" disabled={submitting}>
                  <Send size={16} /> {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
