import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, Search } from 'lucide-react';
import { api } from '../lib/api';
import './TrackOrder.css';

const STATUS_TO_STEP = {
  placed: 1,
  confirmed: 2,
  shipped: 3,
  delivered: 4,
  cancelled: 0,
};

const TrackOrder = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialOrderId = searchParams.get('id') || '';

  const [orderId, setOrderId] = useState(initialOrderId);
  const [isTracking, setIsTracking] = useState(!!initialOrderId);
  const [currentStep, setCurrentStep] = useState(1);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isTracking || !orderId.trim()) return;
    setError('');
    setOrder(null);
    api.getOrder(orderId.trim())
      .then(({ data }) => {
        setOrder(data);
        setCurrentStep(STATUS_TO_STEP[data.orderStatus] || 1);
      })
      .catch((e) => setError(e.message || 'Order not found'));
  }, [isTracking, orderId]);

  const handleTrack = (e) => {
    e.preventDefault();
    if (orderId.trim()) setIsTracking(true);
  };

  const steps = [
    { id: 1, title: 'Order Confirmed', icon: CheckCircle, date: 'Today, 10:00 AM' },
    { id: 2, title: 'Packed', icon: Package, date: 'Pending' },
    { id: 3, title: 'Shipped', icon: Truck, date: 'Pending' },
    { id: 4, title: 'Delivered', icon: Home, date: 'Pending' },
  ];

  return (
    <div className="track-page section">
      <div className="container max-w-2xl">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="h2 mb-4">Track Your <span className="text-accent">Order</span></h1>
          <p className="text-secondary">Enter your order ID below to check the current delivery status.</p>
        </div>

        <div className="glass p-8 rounded-xl mb-8 animate-fade-in delay-100">
          <form onSubmit={handleTrack} className="flex gap-4">
            <div className="input-group mb-0 flex-grow">
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. ORD-123456" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <Search size={18} /> Track
            </button>
          </form>
        </div>

        {isTracking && error && (
          <div className="checkout-error">{error}</div>
        )}

        {isTracking && order && (
          <div className="tracking-timeline glass p-8 rounded-xl animate-fade-in">
            <div className="mb-6 border-b pb-4">
              <h3 className="h3">Order {order.orderId}</h3>
              <p className="text-secondary">
                Status: <strong style={{ textTransform: 'capitalize' }}>{order.orderStatus}</strong>
                {' · '}Payment: <strong style={{ textTransform: 'capitalize' }}>{order.paymentStatus}</strong>
              </p>
            </div>
            
            <div className="timeline">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep >= step.id;
                const isCurrent = currentStep === step.id;
                
                return (
                  <div key={step.id} className={`timeline-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
                    <div className="timeline-icon-wrapper">
                      <div className="timeline-icon"><Icon size={20} /></div>
                      {index < steps.length - 1 && <div className="timeline-line"></div>}
                    </div>
                    <div className="timeline-content">
                      <h4 className="font-semibold">{step.title}</h4>
                      <p className="text-sm text-secondary">{isActive && currentStep > step.id ? 'Completed' : step.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 pt-6 border-t text-center">
              <Link to="/" className="btn btn-outline">Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
