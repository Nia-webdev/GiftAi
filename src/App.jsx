import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>

      <Routes>

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

    </BrowserRouter>
  );
}

export default App;