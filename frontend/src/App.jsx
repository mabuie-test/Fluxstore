import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import Product from './pages/Product.jsx';
import Cart from './pages/Cart.jsx';
import Account from './pages/Account.jsx';
import AdminConsole from './pages/AdminConsole.jsx';
import SellerOnboarding from './pages/SellerOnboarding.jsx';
import Shell from './components/Shell.jsx';
import NotificationTray from './components/NotificationTray.jsx';
import useSession from './state/useSession.js';
import { fetchNotifications } from './api/client.js';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const { token, user, setNotifications } = useSession();

  useEffect(() => {
    if (!token) return;
    fetchNotifications(token).then((items) => setNotifications(items));
  }, [token, setNotifications]);

  const adminRoles = ['admin', 'staff', 'superadmin'];

  return (
    <Shell>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/account" element={<Account />} />
        <Route path="/seller/apply" element={<SellerOnboarding />} />
        <Route
          path="/admin"
          element={
            adminRoles.includes(user?.role) ? (
              <AdminConsole />
            ) : (
              <Navigate to="/account" replace state={{ from: '/admin' }} />
            )
          }
        />
      </Routes>
      <NotificationTray />
    </Shell>
  );
}

export default App;
