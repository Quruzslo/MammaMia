"use client";
import { createContext, useState, useEffect } from "react";

export const cartContext = createContext();

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [sideCartState, setSideCartState] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("MyCartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("MyCartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  const addToCart = (product, date, dayName, count) => {
    const validCount =
      typeof count === "number" ? count : product.quantity || 1;

    const isAlacarte = product.foodType === "alacarte" || !date;
    const targetDate = isAlacarte ? "alacarte" : date;
    const targetDayName = isAlacarte ? "A'la carte" : dayName;

    setCartItems((prevItems) => {
      const existingDayIndex = prevItems.findIndex(
        (d) => d.date === targetDate,
      );

      if (existingDayIndex > -1) {
        const updatedCart = [...prevItems];
        const day = { ...updatedCart[existingDayIndex] };
        const existingFoodIndex = day.items.findIndex(
          (f) => f.name === product.name,
        );

        if (existingFoodIndex > -1) {
          const updatedItems = [...day.items];

          const currentQty = updatedItems[existingFoodIndex].quantity || 0;

          updatedItems[existingFoodIndex] = {
            ...updatedItems[existingFoodIndex],
            quantity: currentQty + validCount,
          };
          day.items = updatedItems;
        } else {
          day.items = [{ ...product, quantity: validCount }, ...day.items];
        }

        updatedCart[existingDayIndex] = day;
        return updatedCart;
      }

      return [
        ...prevItems,
        {
          date: targetDate,
          dayName: targetDayName,
          items: [{ ...product, quantity: validCount }],
        },
      ];
    });
  };

  const removeFromCart = (removable, date) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((day) => {
          if (day.date === date) {
            return {
              ...day,
              items: day.items.filter((food) => food.name !== removable.name),
            };
          }
          return day;
        })
        .filter((day) => day.items.length > 0);
    });
  };

  const updateItemQuantity = (productName, date, amount) => {
    setCartItems((prevItems) =>
      prevItems.map((day) => {
        if (day.date === date) {
          return {
            ...day,
            items: day.items.map((food) => {
              if (food.name === productName) {
                const currentQty = food.quantity || 1;
                return {
                  ...food,
                  quantity: Math.max(1, currentQty + amount),
                };
              }
              return food;
            }),
          };
        }
        return day;
      }),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const animateSideCart = () => {
    setSideCartState(!sideCartState);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    animateSideCart,
    sideCartState,
  };

  if (!isMounted) {
    return null;
  }

  return <cartContext.Provider value={value}>{children}</cartContext.Provider>;
}
