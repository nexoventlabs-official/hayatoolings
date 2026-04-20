import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './PolicyPages.css';

const ReturnsPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="policy-page">
      <div className="container">
        <button className="policy-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="policy-content">
          <h1>Returns & Refunds Policy</h1>
          <p className="policy-updated">Last updated: April 2026</p>

          <h2>1. Return Eligibility</h2>
          <p>We want you to be completely satisfied with your purchase. You may return a product if:</p>
          <ul>
            <li>The product is defective or damaged upon delivery.</li>
            <li>The wrong product was shipped to you.</li>
            <li>The product does not match the description on the website.</li>
          </ul>
          <p>Returns must be initiated within <strong>7 days</strong> of receiving the product.</p>

          <h2>2. Non-Returnable Items</h2>
          <p>The following items are not eligible for return:</p>
          <ul>
            <li>Products that have been used, installed, or altered.</li>
            <li>Customized or made-to-order products.</li>
            <li>Consumable items such as cutting inserts, abrasives, and lubricants (unless defective).</li>
            <li>Products without original packaging or tags.</li>
          </ul>

          <h2>3. How to Initiate a Return</h2>
          <p>To initiate a return, please:</p>
          <ul>
            <li>Contact us at <a href="mailto:hayatoolings@gmail.com">hayatoolings@gmail.com</a> with your order number.</li>
            <li>Provide photos of the product and describe the issue.</li>
            <li>Our team will review and approve the return within 2 business days.</li>
          </ul>

          <h2>4. Return Shipping</h2>
          <p>For defective or incorrect items, return shipping costs will be borne by Haya Toolings. For other eligible returns, the customer is responsible for return shipping charges.</p>

          <h2>5. Refund Process</h2>
          <ul>
            <li>Refunds are processed within <strong>7-10 business days</strong> after we receive and inspect the returned product.</li>
            <li>Refunds will be credited to the original payment method.</li>
            <li>Shipping charges are non-refundable unless the return is due to our error.</li>
          </ul>

          <h2>6. Exchanges</h2>
          <p>If you received a defective or wrong product, we offer free exchanges subject to availability. If the product is out of stock, a full refund will be issued.</p>

          <h2>7. Damaged in Transit</h2>
          <p>If your order arrives damaged, please do not accept the delivery. If already accepted, contact us within <strong>24 hours</strong> with photos of the damaged package and product.</p>

          <h2>8. Contact Us</h2>
          <p>For return and refund queries, email us at <a href="mailto:hayatoolings@gmail.com">hayatoolings@gmail.com</a> or call our customer support.</p>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPolicy;
