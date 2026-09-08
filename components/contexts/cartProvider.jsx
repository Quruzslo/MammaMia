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
    setCartItems((prevItems) => {
      const existingDayIndex = prevItems.findIndex((d) => d.date === date);

      if (existingDayIndex > -1) {
        const updatedCart = [...prevItems];
        const day = { ...updatedCart[existingDayIndex] };
        const existingFoodIndex = day.items.findIndex(
          (f) => f.name === product.name,
        );

        if (existingFoodIndex > -1) {
          const updatedItems = [...day.items];
          updatedItems[existingFoodIndex] = {
            ...updatedItems[existingFoodIndex],
            quantity: updatedItems[existingFoodIndex].quantity + count,
          };
          day.items = updatedItems;
        } else {
          day.items = [{ ...product, quantity: count }, ...day.items];
        }

        updatedCart[existingDayIndex] = day;
        return updatedCart;
      }

      return [
        ...prevItems,
        {
          date: date,
          dayName: dayName,
          items: [{ ...product, quantity: count }],
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
                return {
                  ...food,
                  quantity: Math.max(1, food.quantity + amount),
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
