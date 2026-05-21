"use client";
import { createContext, useState, useContext, useEffect } from "react";

export const cartContext = createContext();

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("MyCartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [sideCartState, setSideCartState] = useState(false);

  useEffect(() => {
    localStorage.setItem("MyCartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, date, dayName) => {
    setCartItems((prevItems) => {
      // 1. Megnézzük, hogy ez a nap szerepel-e már a kosárban
      const existingDayIndex = prevItems.findIndex((d) => d.date === date);

      if (existingDayIndex > -1) {
        // A NAP már ott van, most nézzük meg, hogy az ÉTEL benne van-e azon a napon
        const updatedCart = [...prevItems];
        const day = { ...updatedCart[existingDayIndex] };
        const existingFoodIndex = day.items.findIndex(
          (f) => f.name === product.name,
        );

        if (existingFoodIndex > -1) {
          // Ha az étel már szerepel ezen a napon, növeljük a mennyiségét
          const updatedItems = [...day.items];
          updatedItems[existingFoodIndex] = {
            ...updatedItems[existingFoodIndex],
            quantity: updatedItems[existingFoodIndex].quantity + 1,
          };
          day.items = updatedItems;
        } else {
          // Ha új étel ezen a napon, adjuk hozzá a listához
          day.items = [{ ...product, quantity: 1 }, ...day.items];
        }

        updatedCart[existingDayIndex] = day;
        return updatedCart;
      }

      // 2. Ha ez a NAP még nem létezik, hozzunk létre egy új nap-objektumot
      return [
        ...prevItems,
        {
          date: date,
          dayName: dayName,
          items: [{ ...product, quantity: 1 }],
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
        // megfelelő nap check
        if (day.date === date) {
          return {
            ...day,
            items: day.items.map((food) => {
              // napon belül az étel kiválasztása
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

  return <cartContext.Provider value={value}>{children}</cartContext.Provider>;
}
