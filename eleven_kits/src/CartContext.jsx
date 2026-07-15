import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function addToCart(product, variant, quantity = 1, customization = null) {
    setItems((prev) => {
      // Si el producto tiene personalización, cada línea es única (no se agrupa),
      // porque dos camisetas con nombres distintos no pueden ser "la misma línea".
      const hasCustomization =
        customization &&
        (customization.customizationName ||
          customization.customizationNumber ||
          customization.hasPatches);

      if (!hasCustomization) {
        const existing = prev.find(
          (item) =>
            item.productId === product.id &&
            item.variantId === variant?.id &&
            !item.customization,
        );

        if (existing) {
          return prev.map((item) =>
            item === existing
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }
      }

      return [
        ...prev,
        {
          cartItemId: crypto.randomUUID(),
          productId: product.id,
          variantId: variant?.id || null,
          name: product.name,
          price: product.price,
          size: variant?.size || null,
          image: product.image_url,
          quantity,
          customization: hasCustomization ? customization : null,
        },
      ];
    });
  }

  function removeFromCart(cartItemId) {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  }

  function updateQuantity(cartItemId, quantity) {
    setItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item,
      ),
    );
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
