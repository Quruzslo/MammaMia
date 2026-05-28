"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function UserData() {
  const { status, data: session } = useSession();
  const validPerson = session?.user;

  // 1. Állapot (state) az input mezőknek
  const [formData, setFormData] = useState({
    city: "",
    street: "",
    houseNumber: "",
    tel: "",
  });

  // Állapotok a betöltéshez, hiba/sikeres mentés visszajelzéshez
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 2. Adatok betöltése a DB-ből (Component Mount-kor)
  useEffect(() => {
    const fetchUserData = async () => {
      // Ha még tölt a session, vagy nem vagyunk belépve, megállunk
      if (status !== "authenticated") return;

      try {
        setLoading(true);

        const response = await fetch("/api/user-data-fetch");

        if (response.ok) {
          const data = await response.json();
          setFormData({
            city: data.city || "",
            street: data.street || "",
            houseNumber: data.houseNumber || "",
            tel: data.tel || "",
          });
        }
      } catch (error) {
        console.error("Hiba az adatok lekérésekor:", error);
        setMessage({
          type: "error",
          text: "Nem sikerült betölteni a profiladatokat.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [status]);

  // 3. Input változások kezelése
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 4. Adatok mentése / frissítése
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/user-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Adatok sikeresen frissítve!" });
      } else {
        throw new Error("Sikertelen mentés");
      }
    } catch (error) {
      console.error("Hiba a mentés során:", error);
      setMessage({
        type: "error",
        text: "Hiba történt a mentés során. Próbáld újra!",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 text-neutral-400">
        Adatok betöltése...
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-100">
          Szállítási & Értesítési adatok
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Kérjük, pontosan add meg az adataidat a későbbi gyors fizetéshez és
          kiszállításhoz.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Város */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="city"
            className="text-xs font-semibold text-neutral-400 uppercase tracking-wider"
          >
            Város
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Pl. Budapest"
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-gray-200 text-sm focus:outline-none focus:border-teal-500 transition-colors"
            required
          />
        </div>

        {/* Utca és Házszám egy sorban */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 flex flex-col gap-1.5">
            <label
              htmlFor="street"
              className="text-xs font-semibold text-neutral-400 uppercase tracking-wider"
            >
              Utca / Köz / Út
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="Pl. Kifőzde utca"
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-gray-200 text-sm focus:outline-none focus:border-teal-500 transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="houseNumber"
              className="text-xs font-semibold text-neutral-400 uppercase tracking-wider"
            >
              Házszám
            </label>
            <input
              type="text"
              id="houseNumber"
              name="houseNumber"
              value={formData.houseNumber}
              onChange={handleChange}
              placeholder="Pl. 12/A"
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-gray-200 text-sm focus:outline-none focus:border-teal-500 transition-colors"
              required
            />
          </div>
        </div>

        {/* Telefonszám */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="tel"
            className="text-xs font-semibold text-neutral-400 uppercase tracking-wider"
          >
            Telefonszám
          </label>
          <input
            type="tel"
            id="tel"
            name="tel"
            value={formData.tel}
            onChange={handleChange}
            placeholder="Pl. +36 30 123 4567"
            className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-gray-200 text-sm focus:outline-none focus:border-teal-500 transition-colors"
            required
          />
        </div>

        {/* Visszajelző üzenetek (Siker / Hiba) */}
        {message.text && (
          <div
            className={`p-3 rounded-xl text-xs font-medium text-center ${
              message.type === "success"
                ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Módosítás / Mentés Gomb */}
        <button
          type="submit"
          disabled={saving}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:bg-teal-800 text-neutral-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-teal-500/10 active:scale-[0.98]"
        >
          {saving ? "Mentés folyamatban..." : "Adatok módosítása"}
        </button>
      </form>
    </div>
  );
}
