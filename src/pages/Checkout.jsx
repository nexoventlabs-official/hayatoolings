import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, CreditCard, Truck, CheckCircle, Banknote, Smartphone, Package } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderId, setOrderId] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);

  const formatPrice = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const handleCheckout = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!paymentMethod) return;
      setIsProcessing(true);
      setOrderItems([...cart]);
      setOrderTotal(cartTotal);
      setTimeout(() => {
        const id = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        setOrderId(id);
        clearCart();
        setIsProcessing(false);
        setStep(3);
      }, 2000);
    }
  };

  if (cart.length === 0 && step === 1) {
    return (
      <div className="section container text-center">
        <h2 className="h2 mb-4">Your Cart is Empty</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="checkout-page section">
        <div className="container">
          <div className="order-confirmation animate-fade-in">
            <div className="confirmation-icon">
              <CheckCircle size={64} />
            </div>
            <h2>Order Confirmed!</h2>
            <p className="confirmation-id">Order ID: <strong>{orderId}</strong></p>
            <p className="confirmation-msg">
              Thank you for your purchase! Your order has been placed successfully. 
              We'll send a confirmation to your email shortly.
            </p>

            <div className="confirmation-details">
              <h4>Order Summary</h4>
              <div className="confirmation-items">
                {orderItems.map(item => (
                  <div key={item.id} className="confirmation-item">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="confirmation-total">
                <span>Total Paid</span>
                <span>{formatPrice(orderTotal)}</span>
              </div>
              <div className="confirmation-payment">
                <span>Payment Method</span>
                <span>{paymentMethod === 'card' ? 'Debit / Credit Card' : paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery'}</span>
              </div>
            </div>

            <div className="confirmation-actions">
              <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
              <Link to="/" className="btn btn-outline">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page section">
      <div className="container grid grid-cols-3 gap-8 checkout-layout">
        
        <div className="col-span-2">
          {/* Steps Indicator */}
          <div className="checkout-steps glass mb-8">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-icon"><Truck size={18} /></div>
              <span>Shipping</span>
            </div>
            <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-icon"><CreditCard size={18} /></div>
              <span>Payment</span>
            </div>
            <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-icon"><CheckCircle size={18} /></div>
              <span>Confirmation</span>
            </div>
          </div>

          <div className="checkout-form-container glass p-8 rounded-xl animate-fade-in">
            <h3 className="h3 mb-6">{step === 1 ? 'Shipping Details' : 'Payment Information'}</h3>
            <form id="checkout-form" onSubmit={handleCheckout}>
              {step === 1 ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="input-group"><label className="input-label">First Name</label><input required className="input-field" /></div>
                    <div className="input-group"><label className="input-label">Last Name</label><input required className="input-field" /></div>
                  </div>
                  <div className="input-group"><label className="input-label">Address</label><input required className="input-field" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="input-group"><label className="input-label">City</label><input required className="input-field" /></div>
                    <div className="input-group"><label className="input-label">PIN Code</label><input required className="input-field" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="input-group"><label className="input-label">Phone Number</label><input type="tel" required className="input-field" placeholder="+91" /></div>
                    <div className="input-group"><label className="input-label">Email</label><input type="email" required className="input-field" /></div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-secondary mb-6">Select your preferred payment method</p>
                  
                  <div className="payment-methods">
                    <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                      <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                      <div className="payment-option-icon"><CreditCard size={22} /></div>
                      <div className="payment-option-text">
                        <strong>Debit / Credit Card</strong>
                        <span>Visa, Mastercard, RuPay</span>
                      </div>
                    </label>

                    <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                      <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                      <div className="payment-option-icon"><Smartphone size={22} /></div>
                      <div className="payment-option-text">
                        <strong>UPI</strong>
                        <span>GPay, PhonePe, Paytm</span>
                      </div>
                    </label>

                    <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                      <div className="payment-option-icon"><Banknote size={22} /></div>
                      <div className="payment-option-text">
                        <strong>Cash on Delivery</strong>
                        <span>Pay when you receive</span>
                      </div>
                    </label>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="card-details-form animate-fade-in">
                      <div className="input-group">
                        <label className="input-label">Card Number</label>
                        <input placeholder="XXXX XXXX XXXX XXXX" className="input-field" required maxLength={19} />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Name on Card</label>
                        <input placeholder="Full name as on card" className="input-field" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="input-group">
                          <label className="input-label">Expiry Date</label>
                          <input placeholder="MM/YY" className="input-field" required maxLength={5} />
                        </div>
                        <div className="input-group">
                          <label className="input-label">CVV</label>
                          <input type="password" placeholder="•••" className="input-field" required maxLength={4} />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="upi-details-form animate-fade-in">
                      <div className="input-group">
                        <label className="input-label">UPI ID</label>
                        <input placeholder="yourname@upi" className="input-field" required />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="cod-notice animate-fade-in">
                      <Package size={20} />
                      <p>You will pay <strong>{formatPrice(cartTotal)}</strong> at the time of delivery. Please keep the exact amount ready.</p>
                    </div>
                  )}
                </>
              )}
            </form>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="order-summary glass p-6 rounded-xl h-fit sticky-top">
          <h3 className="h3 mb-4">Order Summary</h3>
          <div className="cart-items mb-4">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-details">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">{formatPrice(item.price)}</span>
                </div>
                <div className="item-actions">
                  <div className="qty-controls">
                    <button type="button" onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                  <button type="button" className="text-red hover-text-accent" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="summary-totals border-t pt-4 mt-4">
            <div className="total-row font-bold text-lg">
              <span>Total:</span>
              <span className="text-accent">{formatPrice(cartTotal)}</span>
            </div>
          </div>

          <button 
            type="submit" 
            form="checkout-form"
            className="btn btn-primary w-full mt-6 justify-center"
            disabled={isProcessing || (step === 2 && !paymentMethod)}
          >
            {isProcessing ? 'Processing...' : (step === 1 ? 'Proceed to Payment' : 'Place Order')}
          </button>
          
          {step === 2 && (
            <button 
              type="button" 
              className="btn btn-outline w-full mt-4 justify-center"
              onClick={() => setStep(1)}
              disabled={isProcessing}
            >
              Back to Shipping
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Checkout;
