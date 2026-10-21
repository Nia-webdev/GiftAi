
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

function getSavedData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() =>
    getSavedData("giftai-cart", [])
  );

  const [wishlist, setWishlist] = useState(() =>
    getSavedData("giftai-wishlist", [])
  );

  useEffect(() => {
    localStorage.setItem("giftai-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("giftai-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (gift) => {
    const id = String(gift.id ?? gift.name);
    const price = Number(
      String(gift.price).replace(/[^0-9.]/g, "")
    );

    const newItem = {
      id,
      name: gift.name,
      price: Number.isFinite(price) ? price : 0,
      image: gift.image || "",
      quantity: 1,
    };

    setCartItems((items) => {
      const existing = items.find((item) => item.id === id);

      if (existing) {
        return items.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...items, newItem];
    });
  };

  const updateQuantity = (id, change) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };
  const clearCart = () => {
  setCartItems([]);
};

  const toggleWishlist = (gift) => {
    const id = String(gift.id ?? gift.name);

    setWishlist((items) =>
      items.includes(id)
        ? items.filter((itemId) => itemId !== id)
        : [...items, id]
    );
  };

  const isWishlisted = (gift) =>
    wishlist.includes(String(gift.id ?? gift.name));

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlist,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
