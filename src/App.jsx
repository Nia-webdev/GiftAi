
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";

import Home from "./pages/Home";
import Gifts from "./pages/Gifts";
import GiftDetails from "./pages/GiftDetails";
import AIRecommendation from "./pages/AiRecommendation";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import TrackOrder from "./pages/TrackOrder";
import Login from "./pages/Login";
import Register from "./pages/Register";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
  key={location.pathname}
  initial={{ opacity: 0, y: 6 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -4 }}
  transition={{
    duration: 0.22,
    ease: [0.22, 1, 0.36, 1],
  }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/gifts" element={<Gifts />} />
          <Route
            path="/gift-details"
            element={<GiftDetails />}
          />
          <Route
            path="/ai-recommendation"
            element={<AIRecommendation />}
          />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route
            path="/track-order"
            element={<TrackOrder />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
