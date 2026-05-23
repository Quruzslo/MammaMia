"use client";

import { signIn } from "next-auth/react";

export default function BelepesPage() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        gap: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Bejelentkezés a Webshopba</h1>

      <button
        onClick={() => signIn("google")}
        style={{
          padding: "12px 24px",
          background: "#4285F4",
          color: "white",
          borderRadius: "5px",
          border: "none",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      >
        Bejelentkezés Google-lel
      </button>
    </main>
  );
}
