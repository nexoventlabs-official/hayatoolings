import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './PolicyPages.css';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="policy-page">
      <div className="container">
        <button className="policy-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="policy-content">
          <h1>Privacy Policy</h1>
          <p className="policy-updated">Last updated: April 2026</p>

          <h2>1. Information We Collect</h2>
          <p>We collect information that you provide directly to us when using our website:</p>
          <ul>
            <li><strong>Personal Information:</strong> Name, email address, phone number, shipping address.</li>
            <li><strong>Payment Information:</strong> Payment details processed through secure third-party gateways.</li>
            <li><strong>Usage Data:</strong> Pages visited, time spent, browser type, and device information.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process and fulfill your orders.</li>
            <li>Communicate with you about orders, products, and promotions.</li>
            <li>Improve our website and customer experience.</li>
            <li>Comply with legal obligations.</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
          <ul>
            <li>Service providers who assist in order fulfillment and delivery.</li>
            <li>Payment processors for secure transaction handling.</li>
            <li>Legal authorities when required by law.</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>

          <h2>5. Cookies</h2>
          <p>Our website uses cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, but this may affect website functionality.</p>

          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access and review your personal data.</li>
            <li>Request correction or deletion of your data.</li>
            <li>Opt out of marketing communications.</li>
            <li>Request a copy of your data in a portable format.</li>
          </ul>

          <h2>7. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>

          <h2>8. Contact Us</h2>
          <p>For privacy-related inquiries, please contact us at <a href="mailto:hayatoolings@gmail.com">hayatoolings@gmail.com</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
