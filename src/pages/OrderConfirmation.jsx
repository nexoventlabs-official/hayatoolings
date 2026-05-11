import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle, Clock, Package, AlertTriangle } from 'lucide-react';
import { api } from '../lib/api';
import './Checkout.css';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [params] = useSearchParams();
  const status = params.get('status'); // cod | processing | success | failed
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    api.getOrder(orderId)
      .then(({ data }) => alive && setOrder(data))
      .catch((e) => alive && setError(e.message || 'Could not load order'));
    return () => { alive = false; };
  }, [orderId]);

  // If we just returned from PayGlocal, mark our local txn as pending until
  // the webhook arrives. Status param `processing` triggers this soft signal.
  useEffect(() => {
    if (status === 'processing') {
      api.postReturn({ orderId, status: 'pending' }).catch(() => {});
    }
  }, [orderId, status]);

  const symbol = order && (order.currency === 'USD' ? '$' : order.currency === 'EUR' ? '€' : '₹');

  const Icon =
    status === 'cod' ? Package :
    status === 'success' ? CheckCircle :
    status === 'failed' ? AlertTriangle : Clock;

  const heading =
    status === 'cod' ? 'Order Placed (Cash on Delivery)' :
    status === 'success' ? 'Payment Successful' :
    status === 'failed' ? 'Payment Failed' : 'Payment Processing';

  const message =
    status === 'cod' ? 'Your order has been placed. Please keep the cash ready at delivery.' :
    status === 'success' ? 'Thank you! Your payment was confirmed by PayGlocal.' :
    status === 'failed' ? 'Your payment did not go through. You can retry from your cart.' :
    'We have received your payment notification. We will send a confirmation email once PayGlocal confirms the transaction.';

  return (
    <div className="checkout-page section">
      <div className="container">
        <div className="order-confirmation animate-fade-in">
          <div className="confirmation-icon" style={{ color: status === 'failed' ? '#ef4444' : status === 'success' ? '#16a34a' : '#f59e0b' }}>
            <Icon size={64} />
          </div>
          <h2>{heading}</h2>
          <p className="confirmation-id">Order ID: <strong>{orderId}</strong></p>
          <p className="confirmation-msg">{message}</p>

          {error && <div className="checkout-error">{error}</div>}

          {order && (
            <div className="confirmation-details">
              <h4>Order Summary</h4>
              <div className="confirmation-items">
                {order.items.map((it) => (
                  <div key={it.productId} className="confirmation-item">
                    <span>{it.name} × {it.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="confirmation-total">
                <span>Total</span>
                <span>{symbol}{order.totalDisplay} {order.currency}</span>
              </div>
              <div className="confirmation-payment">
                <span>Payment Status</span>
                <span style={{ textTransform: 'capitalize' }}>{order.paymentStatus}</span>
              </div>
            </div>
          )}

          <div className="confirmation-actions">
            <Link to={`/track?id=${orderId}`} className="btn btn-primary">Track Order</Link>
            <Link to="/products" className="btn btn-outline">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
