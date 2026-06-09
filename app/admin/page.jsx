"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      if (res?.error) {
        setError("Hibás email cím vagy jelszó!");
        setLoading(false);
      } else {
        router.push("/admin/rendelesek");
        router.refresh();
      }
    } catch (err) {
      setError("Valami hiba történt a bejelentkezés során.");
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-neutral-900 flex items-center justify-center overflow-hidden">
      {/* Háttér effekt */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-900/20 blur-[120px]" />
      </div>

      {/* Felső vékony csík dekoráció */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/40 to-transparent" />

      <div className="relative z-10 w-full max-w-sm mx-auto px-6 animate-fade-in">
        {/* Bejelentkező kártya */}
        <div className="bg-neutral-800/60 backdrop-blur-sm border border-neutral-700/50 rounded-sm p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold text-white tracking-tight mb-2 uppercase">
              MammaMia Admin
            </h1>
            <p className="text-sm text-gray-400">
              Központi adminisztrációs felület
            </p>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-700/60" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-neutral-800 px-3 text-xs text-white uppercase tracking-widest">
                Azonosítás
              </span>
            </div>
          </div>

          {/* Hibaüzenet doboz */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-900/50 text-red-400 text-xs text-center font-medium animate-shake">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5 pl-1">
                E-mail cím
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mammamia.hu"
                className="w-full px-4 py-3 rounded-xl bg-neutral-900/60 border border-neutral-700/60 text-sm text-white placeholder-gray-600 transition-all duration-200 focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5 pl-1">
                Jelszó
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-neutral-900/60 border border-neutral-700/60 text-sm text-white placeholder-gray-600 transition-all duration-200 focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                group w-full flex items-center justify-center gap-3 mt-6
                px-5 py-3 rounded-sm
                bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800/40
                border border-teal-500/30 disabled:border-transparent
                text-sm font-semibold text-white disabled:text-gray-500
                transition-all duration-200 ease-out cursor-pointer disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:ring-offset-2 focus:ring-offset-neutral-800
                shadow-lg shadow-teal-950/40
              "
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Belépés az adminisztrációba"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
