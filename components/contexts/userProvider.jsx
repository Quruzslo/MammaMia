"use client";
import { createContext, useState } from "react";

export const userContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchUser = async (credentials) => {
    try {
      if (!credentials.email || !credentials.password) {
        alert("Töltsd ki az összes mezőt!");
        return;
      }

      const response = await fetch("http://localhost:3000/auth-datas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Sikertelen bejelentkezés - ellenőrizd az adataidat!");
      }

      const result = await response.json();

      console.log("Siker:", result.user);

      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      setUser(result.user);
      setIsLoggedIn(true);
      return result.user;
    } catch (error) {
      console.error("Hiba történt:", error.message);
      alert(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
  };

  const value = {
    fetchUser,
    logout,
    user,
    isLoggedIn,
  };

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
}
