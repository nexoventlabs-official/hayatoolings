import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import QuoteRequest from './pages/QuoteRequest';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import About from './pages/About';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PolicyPrivacy';
import ShippingPolicy from './pages/ShippingPolicy';
import ReturnsPolicy from './pages/ReturnsPolicy';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import OrderConfirmation from './pages/OrderConfirmation';
import TrackOrder from './pages/TrackOrder';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminEnquiries from './pages/admin/AdminEnquiries';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Storefront layout (header + footer)
const StorefrontLayout = ({ children }) => (
  <>
    <Header />
    <main className="main-content" style={{ flexGrow: 1 }}>{children}</main>
    <Footer />
  </>
);

function App() {
  return (
    <CurrencyProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Admin section — no storefront header/footer */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:orderId" element={<AdminOrderDetail />} />
              <Route path="transactions" element={<AdminTransactions />} />
              <Route path="enquiries" element={<AdminEnquiries />} />
            </Route>

            {/* Storefront */}
            <Route
              path="/*"
              element={
                <StorefrontLayout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/quote" element={<QuoteRequest />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order/:orderId" element={<OrderConfirmation />} />
                    <Route path="/track" element={<TrackOrder />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/terms" element={<TermsConditions />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/shipping" element={<ShippingPolicy />} />
                    <Route path="/returns" element={<ReturnsPolicy />} />
                  </Routes>
                </StorefrontLayout>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </CurrencyProvider>
  );
}

export default App;
