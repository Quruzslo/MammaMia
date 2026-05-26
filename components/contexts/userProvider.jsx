"use client";

import { createContext } from "react";
import { SessionProvider, signOut } from "next-auth/react";

export const userContext = createContext(null);

export default function UserProvider({ children }) {
  const logout = () => {
    signOut({ callbackUrl: "/" });
  };

  const value = {
    logout,
  };

  return (
    <SessionProvider>
      <userContext.Provider value={value}>{children}</userContext.Provider>
    </SessionProvider>
  );
}
