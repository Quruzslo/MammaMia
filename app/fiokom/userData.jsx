"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function UserData() {
  const { status, data: session } = useSession();
  const validPerson = session?.user;

  const [formData, setFormData] = useState({
    city: "",
    street: "",
    houseNumber: "",
    tel: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 2. Adatok betöltése a DB-ből
  useEffect(() => {
    const fetchUserData = async () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
    <div className="w-full max-w-xl mx-auto bg-white border border-gray-200 p-6 sm:p-8 rounded-sm ">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-lg font-bold text-gray-900">
          Szállítási és értesítési adatok
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Kérjük, pontosan add meg az adataidat a későbbi gyors fizetéshez és
          kiszállításhoz.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Város */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="city"
            className="text-xs font-bold text-gray-500 uppercase tracking-wider"
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
            className="w-full px-4 py-2.5 rounded bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-black focus:ring-0 transition-colors"
            required
          />
        </div>

        {/* Utca és Házszám egy sorban */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 flex flex-col gap-1.5">
            <label
              htmlFor="street"
              className="text-xs font-bold text-gray-500 uppercase tracking-wider"
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
              className="w-full px-4 py-2.5 rounded bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-black focus:ring-0 transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="houseNumber"
              className="text-xs font-bold text-gray-500 uppercase tracking-wider"
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
              className="w-full px-4 py-2.5 rounded bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-black focus:ring-0 transition-colors"
              required
            />
          </div>
        </div>

        {/* Telefonszám */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="tel"
            className="text-xs font-bold text-gray-500 uppercase tracking-wider"
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
            className="w-full px-4 py-2.5 rounded bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-black focus:ring-0 transition-colors"
            required
          />
        </div>

        {/* Visszajelző üzenetek (Siker / Hiba) */}
        {message.text && (
          <div
            className={`p-3.5 rounded text-sm font-semibold text-center ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Módosítás / Mentés Gomb */}
        <button
          type="submit"
          disabled={saving}
          className="w-full mt-4 py-3 px-4 rounded bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold text-sm tracking-wide transition-colors active:scale-[0.99] flex justify-center items-center"
        >
          {saving ? "Mentés folyamatban..." : "Adatok mentése"}
        </button>
      </form>
    </div>
  );
}
