import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../lib/api';
import {
  Trash2, CreditCard, Truck, CheckCircle,
  Globe, AlertCircle, Lock, ShieldCheck, Copy,
} from 'lucide-react';
import './Checkout.css';

const PAYGLOCAL_SCRIPT = 'https://oneclick.payglocal.in/simple.js';

// --- PayGlocal popup prefill -- INTENTIONALLY DISABLED ------------------
//
// PayGlocal's Simple-Pay widget exposes no public API to prefill the
// amount / email / phone fields. We previously tried to push values via
// the native React value-setter + bubbling input events. PayGlocal's
// redux-form middleware then called getState() on a store that had been
// recreated by the popup mount cycle, which produced "Minified Redux
// error #3" in their bundle and silently reverted our values to empty.
//
// The proper fixes are (a) configure fixed-amount Simple-Pay buttons on
// the PayGlocal dashboard, or (b) move to PayGlocal's Initiate-Payment
// API. Both are documented in the chat history. Until one of those is
// in place we leave the popup alone and rely on the backend amount
// cross-check (see backend/routes/payments.js :: checkAmountMatch) to
// reject under-payments.

// --- PayGlocal popup result watcher --------------------------------------
//
// PayGlocal's hosted popup shows a green tick + "Your transaction of X was
// successful!" on success and equivalent text on failure. Because the Simple-
// Pay embed renders the popup inside our DOM (not in a cross-origin iframe)
// we can detect the outcome and call the callback exactly once.
//
// The callback receives { status: 'success' | 'failed', gid }. `gid` is the
// PayGlocal transaction id that the popup prints under the merchant name
// (e.g. "Txn ID: 63E33BF6FDD54A8E").

// Match "transaction ... was successful" but NOT "was not successful" /
// "unsuccessful" — the negative lookbehind prevents false positives.
const SUCCESS_RE = /\btransaction\b[^.\n]{0,80}\bwas\s+successful\b|\bpayment\s+successful\b|\bpayment\s+received\b/i;

// Failure is matched broadly: classic "transaction/payment X" phrases AND any
// of the common issuer-decline reasons that PayGlocal may show in lieu of a
// transaction-level message (insufficient funds, card declined, etc.).
const FAILURE_RE = new RegExp(
  [
    String.raw`\btransaction[^.\n]{0,80}(failed|unsuccessful|declined|cancelled|canceled|not\s+successful)\b`,
    String.raw`\bpayment[^.\n]{0,80}(failed|unsuccessful|declined|cancelled|canceled|not\s+successful)\b`,
    String.raw`\binsufficient\s+(funds|balance)\b`,
    String.raw`\bcard\s+declined\b`,
    String.raw`\bdeclined\s+by\s+(issuer|bank)\b`,
    String.raw`\bdo\s+not\s+hono(u)?r\b`,
    String.raw`\b(unable\s+to\s+process|transaction\s+aborted)\b`,
  ].join('|'),
  'i'
);

const TXN_ID_RE = /Txn\s*ID[:\s]+([A-Za-z0-9-]+)/i;

// "Your transaction of ₹ 1 INR was successful!" → { amount: 1, currency: 'INR' }
// "Your transaction of $25.00 USD ..."          → { amount: 25, currency: 'USD' }
const AMOUNT_RE = /(?:₹|Rs\.?|\$|€)\s*([\d,]+(?:\.\d+)?)\s*(INR|USD|EUR)?/i;
const SYMBOL_TO_CCY = { '₹': 'INR', 'Rs': 'INR', '$': 'USD', '€': 'EUR' };

const extractPaidAmount = (text) => {
  const m = text.match(AMOUNT_RE);
  if (!m) return {};
  const amount = Number(String(m[1]).replace(/,/g, ''));
  let currency = m[2] ? m[2].toUpperCase() : null;
  if (!currency) {
    const sym = (m[0].match(/₹|Rs\.?|\$|€/) || [])[0];
    if (sym) currency = SYMBOL_TO_CCY[sym.replace('.', '')] || null;
  }
  return Number.isFinite(amount) ? { amount, currency } : {};
};

const watchPayglocalResult = (onResult) => {
  if (!onResult) return () => {};
  let done = false;
  const scan = () => {
    if (done) return;
    const text = document.body.innerText || '';
    const txn = text.match(TXN_ID_RE);
    const gid = txn ? txn[1] : undefined;
    // IMPORTANT: check FAILURE_RE first so a popup that shows both "Txn ID:
    // ..." (which happens to contain "ID" — harmless) and "Card declined" is
    // classified correctly. We also want a phrase like "was not successful"
    // to land in the failure branch even though SUCCESS_RE now excludes it.
    if (FAILURE_RE.test(text)) {
      done = true;
      observer.disconnect();
      clearTimeout(timer);
      onResult({ status: 'failed', gid });
    } else if (SUCCESS_RE.test(text)) {
      done = true;
      observer.disconnect();
      clearTimeout(timer);
      // Pull "₹ 1 INR" out of the success line so the backend can compare
      // it against the order total and reject under-payments.
      const paid = extractPaidAmount(text);
      onResult({ status: 'success', gid, ...paid });
    }
  };
  const observer = new MutationObserver(scan);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  // Initial scan in case the result text is already on screen.
  scan();
  // Give up after 15 minutes — well past any reasonable payment session.
  const timer = setTimeout(() => { observer.disconnect(); done = true; }, 15 * 60 * 1000);
  return () => { observer.disconnect(); done = true; clearTimeout(timer); };
};

/**
 * Renders the PayGlocal Simple-Pay embed exactly as the merchant docs say:
 *   <form><script src="...simple.js" data-pb-id="pb_xxx"></script></form>
 *
 * The popup's amount / email / phone fields are filled in by the customer.
 * PayGlocal's Simple-Pay widget has no public API to prefill them.
 */
const PayGlocalButton = ({ pbId, onResult }) => {
  const ref = useRef(null);
  const onResultRef = useRef(onResult);
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);

  useEffect(() => {
    if (!ref.current || !pbId) return;

    // StrictMode in dev runs effects twice. PayGlocal's simple.js is NOT
    // idempotent — running it twice corrupts its internal Redux store
    // ("Minified Redux error #3"). Guard the second execution.
    if (ref.current.dataset.pbMounted === pbId) return;
    ref.current.dataset.pbMounted = pbId;

    const form = document.createElement('form');
    const script = document.createElement('script');
    script.src = PAYGLOCAL_SCRIPT;
    script.setAttribute('data-pb-id', pbId);
    form.appendChild(script);
    ref.current.appendChild(form);

    // On the first click we start watching for the final "successful /
    // failed" outcome so we can sync our backend and redirect the user.
    const el = ref.current;
    let stopWatcher = null;
    const onClick = () => {
      if (!stopWatcher) {
        stopWatcher = watchPayglocalResult((result) => {
          stopWatcher = null;
          onResultRef.current?.(result);
        });
      }
    };
    el.addEventListener('click', onClick);
    return () => {
      el.removeEventListener('click', onClick);
      if (stopWatcher) stopWatcher();
    };
  }, [pbId]);

  return <div className="payglocal-embed" ref={ref} />;
};

const Checkout = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { currency, format, convert, paygButtons, symbols } = useCurrency();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);
  const [countries, setCountries] = useState([]);

  const [shipping, setShipping] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    addressLine1: '', addressLine2: '', city: '', state: '',
    postalCode: '', countryCode: 'IN', country: 'India', notes: '',
  });

  // Load country list once.
  useEffect(() => {
    api.getCountries()
      .then(({ data }) => setCountries(data || []))
      .catch(() => setCountries([]));
  }, []);

  // All currencies (INR/USD/EUR) are fulfilled via PayGlocal hosted button.
  const totalDisplay = convert(cartTotal);
  const totalFormatted = format(cartTotal);
  const paygPbId =
    currency === 'USD' ? paygButtons.usdPbId :
    currency === 'EUR' ? paygButtons.eurPbId :
    currency === 'INR' ? paygButtons.inrPbId : '';

  // Only PayGlocal is supported now.
  const effectiveMethod = 'payglocal';

  const handleCountryChange = (e) => {
    const code = e.target.value;
    const c = countries.find((x) => x.code === code);
    setShipping((s) => ({ ...s, countryCode: code, country: c ? c.name : '' }));
  };

  const handleField = (k) => (e) => setShipping((s) => ({ ...s, [k]: e.target.value }));

  // Creates the order on the server when the user clicks "Continue to Pay".
  // The admin panel will see this row immediately as `pending`, and its
  // status flips to success/failed automatically once PayGlocal returns or
  // fires its webhook (see backend/routes/payments.js).
  const submitOrder = async () => {
    if (createdOrder) { setStep(3); return; }
    setIsProcessing(true);
    setError('');
    try {
      const payload = {
        items: cart.map((it) => ({
          productId: it.id,
          name: it.name,
          image: it.image,
          price: it.price,
          quantity: it.quantity,
        })),
        shipping,
        currency,
        paymentMethod: effectiveMethod,
      };
      const { data } = await api.createOrder(payload);
      setCreatedOrder(data);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Failed to create order');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!effectiveMethod) return;
      submitOrder();
    }
  };

  // Called once watchPayglocalResult detects "successful" or "failed" inside
  // PayGlocal's popup. We push the outcome — including the amount we scraped
  // from the popup — to our backend, which runs a cross-check against the
  // order total. If the customer paid less than what was due, the backend
  // overrides our optimistic 'success' to 'failed', and we redirect them to
  // the failed page instead of the green confirmation page.
  const handlePaymentResult = async ({ status, gid, amount, currency }) => {
    if (!createdOrder) return;
    const orderId = createdOrder.order.orderId;
    let finalStatus = status;
    try {
      const { data } = await api.postReturn({ orderId, status, gid, amount, currency });
      if (data?.order?.paymentStatus) finalStatus = data.order.paymentStatus;
    } catch {
      // Non-fatal: the PayGlocal webhook will reconcile.
    }
    if (finalStatus === 'success') clearCart();
    navigate(`/order/${encodeURIComponent(orderId)}?status=${finalStatus}`);
  };

  // Belt-and-braces: poll our own backend every 3s while the customer is on
  // step 3. Whichever signal lands first — frontend popup watcher, return
  // URL, or webhook — flips order.paymentStatus, and this effect catches it
  // and redirects. This is what saves us when PayGlocal's popup mounts in an
  // iframe / shadow root that document.body.innerText can't see.
  useEffect(() => {
    if (step !== 3 || !createdOrder) return undefined;
    const orderId = createdOrder.order.orderId;
    let cancelled = false;
    let timer;

    const tick = async () => {
      if (cancelled) return;
      try {
        const { data } = await api.getOrder(orderId);
        if (cancelled) return;
        const ps = data?.paymentStatus;
        if (ps && ps !== 'pending') {
          if (ps === 'success') clearCart();
          navigate(`/order/${encodeURIComponent(orderId)}?status=${ps}`);
          return;
        }
      } catch {
        /* network blip — keep polling */
      }
      if (!cancelled) timer = setTimeout(tick, 3000);
    };

    timer = setTimeout(tick, 3000);
    // Hard stop after 15 minutes so we don't poll forever if the customer
    // wandered off mid-payment.
    const stopAfter = setTimeout(() => { cancelled = true; clearTimeout(timer); }, 15 * 60 * 1000);
    return () => { cancelled = true; clearTimeout(timer); clearTimeout(stopAfter); };
  }, [step, createdOrder, clearCart, navigate]);

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="section container text-center">
        <h2 className="h2 mb-4">Your Cart is Empty</h2>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="checkout-page section">
      <div className="container grid grid-cols-3 gap-8 checkout-layout">
        <div className="col-span-2">
          {/* Steps */}
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
              <span>Pay</span>
            </div>
          </div>

          <div className="checkout-form-container glass p-8 rounded-xl animate-fade-in">
            {error && (
              <div className="checkout-error"><AlertCircle size={18} /> <span>{error}</span></div>
            )}

            {step === 1 && (
              <>
                <h3 className="h3 mb-6">Shipping Details <span className="text-secondary" style={{ fontSize: '0.8rem' }}>(Global)</span></h3>
                <form id="checkout-form" onSubmit={handleNext}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="input-group"><label className="input-label">First Name</label><input required className="input-field" value={shipping.firstName} onChange={handleField('firstName')} /></div>
                    <div className="input-group"><label className="input-label">Last Name</label><input required className="input-field" value={shipping.lastName} onChange={handleField('lastName')} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="input-group"><label className="input-label">Email</label><input type="email" required className="input-field" value={shipping.email} onChange={handleField('email')} /></div>
                    <div className="input-group"><label className="input-label">Phone Number</label><input type="tel" required className="input-field" placeholder="+91 ..." value={shipping.phone} onChange={handleField('phone')} /></div>
                  </div>

                  <div className="input-group"><label className="input-label">Address Line 1</label><input required className="input-field" value={shipping.addressLine1} onChange={handleField('addressLine1')} /></div>
                  <div className="input-group"><label className="input-label">Address Line 2 <span className="text-secondary">(optional)</span></label><input className="input-field" value={shipping.addressLine2} onChange={handleField('addressLine2')} /></div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="input-group"><label className="input-label">City</label><input required className="input-field" value={shipping.city} onChange={handleField('city')} /></div>
                    <div className="input-group"><label className="input-label">State / Province</label><input required className="input-field" value={shipping.state} onChange={handleField('state')} /></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="input-group">
                      <label className="input-label"><Globe size={14} style={{ verticalAlign: '-2px', marginRight: 4 }} />Country</label>
                      <select required className="input-field" value={shipping.countryCode} onChange={handleCountryChange}>
                        {countries.length === 0 && <option value="IN">India</option>}
                        {countries.map((c) => (
                          <option key={c.code} value={c.code}>{c.name} ({c.dial})</option>
                        ))}
                      </select>
                    </div>
                    <div className="input-group"><label className="input-label">Postal / ZIP Code</label><input required className="input-field" value={shipping.postalCode} onChange={handleField('postalCode')} /></div>
                  </div>

                  <div className="input-group"><label className="input-label">Order Notes <span className="text-secondary">(optional)</span></label><textarea className="input-field" rows={2} value={shipping.notes} onChange={handleField('notes')} /></div>
                </form>
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="h3 mb-6">Payment</h3>
                <p className="text-secondary mb-6">Pay {totalFormatted} using your preferred method.</p>

                <div className="payment-methods">
                  <label className="payment-option selected">
                    <input type="radio" checked readOnly />
                    <div className="payment-option-icon"><CreditCard size={22} /></div>
                    <div className="payment-option-text">
                      <strong>Online Payment via PayGlocal</strong>
                      <span>{currency === 'INR' ? 'Card / UPI / Netbanking' : `Visa, Mastercard, Amex (in ${currency})`}</span>
                    </div>
                  </label>
                </div>
              </>
            )}

            {step === 3 && createdOrder && (
              <div className="payg-screen animate-fade-in">
                <div className="payg-hero">
                  <div className="payg-hero-icon"><Lock size={26} /></div>
                  <div>
                    <h3 className="h3" style={{ margin: 0 }}>Complete your payment</h3>
                    <p className="text-secondary" style={{ margin: '0.25rem 0 0' }}>
                      Secure checkout powered by PayGlocal
                    </p>
                  </div>
                </div>

                <div className="payg-amount-card">
                  <div className="payg-amount-row">
                    <span className="payg-amount-label">Amount to pay</span>
                    <span className="payg-amount-value">{symbols[currency]}{totalDisplay} <small>{currency}</small></span>
                  </div>
                  <div className="payg-meta">
                    <div>
                      <span>Order</span>
                      <strong>
                        {createdOrder.order.orderId}
                        <button
                          type="button"
                          className="payg-copy"
                          aria-label="Copy order id"
                          onClick={() => navigator.clipboard?.writeText(createdOrder.order.orderId)}
                        >
                          <Copy size={12} />
                        </button>
                      </strong>
                    </div>
                    <div>
                      <span>Items</span>
                      <strong>{createdOrder.order.items.length}</strong>
                    </div>
                    <div>
                      <span>Customer</span>
                      <strong>{createdOrder.order.shipping.firstName} {createdOrder.order.shipping.lastName}</strong>
                    </div>
                  </div>
                </div>

                {paygPbId ? (
                  <div className="payg-card">
                    <div className="payg-card-header">
                      <ShieldCheck size={18} />
                      <span>You'll be redirected to PayGlocal's secure hosted page</span>
                    </div>
                    <div className="payglocal-embed">
                      <PayGlocalButton
                        pbId={paygPbId}
                        onResult={handlePaymentResult}
                      />
                    </div>
                    <div className="payg-trust">
                      <span><Lock size={12} /> 256-bit SSL</span>
                      <span>•</span>
                      <span>PCI-DSS compliant</span>
                      <span>•</span>
                      <span>3D Secure</span>
                    </div>
                  </div>
                ) : (
                  <div className="checkout-error">
                    <AlertCircle size={18} />
                    <span>No PayGlocal button is configured for {currency}. Please contact support.</span>
                  </div>
                )}

              </div>
            )}
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
                  <span className="item-price">{format(item.price)}</span>
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
            <div className="total-row">
              <span>Subtotal</span>
              <span>{format(cartTotal)}</span>
            </div>
            <div className="total-row font-bold text-lg" style={{ marginTop: 8 }}>
              <span>Total</span>
              <span className="text-accent">{totalFormatted}</span>
            </div>
            <div className="summary-currency-note">Currency: <strong>{currency}</strong></div>
          </div>

          {step !== 3 && (
            <button
              type={step === 1 ? 'submit' : 'button'}
              form={step === 1 ? 'checkout-form' : undefined}
              className="btn btn-primary w-full mt-6 justify-center"
              onClick={step === 2 ? handleNext : undefined}
              disabled={isProcessing || (step === 2 && !effectiveMethod)}
            >
              {isProcessing ? 'Processing…' : step === 1 ? 'Proceed to Payment' : 'Continue to Pay'}
            </button>
          )}

          {step === 2 && (
            <button type="button" className="btn btn-outline w-full mt-4 justify-center" onClick={() => setStep(1)} disabled={isProcessing}>
              Back to Shipping
            </button>
          )}

          {step === 3 && (
            <Link to="/products" className="btn btn-outline w-full mt-6 justify-center">Continue Shopping</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
