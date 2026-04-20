import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './PolicyPages.css';

const TermsConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="policy-page">
      <div className="container">
        <button className="policy-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="policy-content">
          <h1>Terms & Conditions</h1>
          <p className="policy-updated">Last updated: April 2026</p>

          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using the Haya Toolings website and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website.</p>

          <h2>2. Products & Pricing</h2>
          <p>All products listed on our website are subject to availability. Prices are listed in Indian Rupees (INR) and may change without prior notice. We reserve the right to modify or discontinue any product at any time.</p>
          <ul>
            <li>Prices are exclusive of applicable taxes unless stated otherwise.</li>
            <li>We make every effort to display accurate product information, but we do not guarantee completeness or accuracy.</li>
            <li>Product images are for illustration purposes and may differ from the actual product.</li>
          </ul>

          <h2>3. Orders & Payment</h2>
          <p>When you place an order, it constitutes an offer to purchase. We reserve the right to accept or reject any order. Payment must be made in full before order processing.</p>
          <ul>
            <li>We accept payment via UPI, credit/debit cards, net banking, and other supported methods.</li>
            <li>All transactions are processed through secure payment gateways.</li>
            <li>Order confirmation will be sent to your registered email address.</li>
          </ul>

          <h2>4. User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.</p>

          <h2>5. Intellectual Property</h2>
          <p>All content on this website, including text, graphics, logos, images, and software, is the property of Haya Toolings and is protected by applicable intellectual property laws.</p>

          <h2>6. Limitation of Liability</h2>
          <p>Haya Toolings shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or services. Our total liability shall not exceed the amount paid for the product in question.</p>

          <h2>7. Governing Law</h2>
          <p>These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in our registered city.</p>

          <h2>8. Contact Us</h2>
          <p>If you have any questions about these Terms & Conditions, please contact us at <a href="mailto:hayatoolings@gmail.com">hayatoolings@gmail.com</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
