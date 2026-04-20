import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './PolicyPages.css';

const ShippingPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="policy-page">
      <div className="container">
        <button className="policy-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="policy-content">
          <h1>Shipping Policy</h1>
          <p className="policy-updated">Last updated: April 2026</p>

          <h2>1. Shipping Coverage</h2>
          <p>We ship across India to all serviceable pin codes. For bulk or industrial orders, we also offer customized shipping solutions. International shipping is available on request for select products.</p>

          <h2>2. Processing Time</h2>
          <p>Orders are typically processed within <strong>1-2 business days</strong> after payment confirmation. Custom or bulk orders may require additional processing time, which will be communicated at the time of order.</p>

          <h2>3. Delivery Timeline</h2>
          <ul>
            <li><strong>Standard Delivery:</strong> 5-7 business days across India.</li>
            <li><strong>Express Delivery:</strong> 2-3 business days (available for select locations).</li>
            <li><strong>Bulk/Industrial Orders:</strong> 7-14 business days depending on quantity and location.</li>
          </ul>

          <h2>4. Shipping Charges</h2>
          <ul>
            <li>Free shipping on orders above ₹5,000.</li>
            <li>Standard shipping charges apply for orders below ₹5,000.</li>
            <li>Express delivery charges are calculated at checkout.</li>
            <li>Heavy machinery and oversized items may incur additional freight charges.</li>
          </ul>

          <h2>5. Order Tracking</h2>
          <p>Once your order is shipped, you will receive a tracking number via email and SMS. You can use this to track your shipment in real-time through our logistics partner's website.</p>

          <h2>6. Delivery Issues</h2>
          <p>If your order is delayed, damaged during transit, or lost, please contact our support team within <strong>48 hours</strong> of the expected delivery date. We will investigate and resolve the issue promptly.</p>

          <h2>7. Undeliverable Packages</h2>
          <p>If a package cannot be delivered due to an incorrect address or recipient unavailability after multiple attempts, the package will be returned to our warehouse. Re-shipping charges may apply.</p>

          <h2>8. Contact Us</h2>
          <p>For shipping-related queries, reach us at <a href="mailto:hayatoolings@gmail.com">hayatoolings@gmail.com</a> or call our support line.</p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;
