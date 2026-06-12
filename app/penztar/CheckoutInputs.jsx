"use client";
import { useState, useEffect } from "react";
import { validateCheckoutForm } from "../../utils/validateCheckoutForm.js";
import CheckoutStripe from "./CheckoutStripe.jsx";
import FloatingInput from "./FloatingInput.jsx";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { useSession } from "next-auth/react";

const stripePromise = loadStripe(
  "pk_test_51TU3e2GXOLsnJNTFtaucBVNqDIZkGg4Kr5tZPdEVc6nt6BalUxTK9JgkW4S7grTRgBchl3KSfpkFQ9Nw1lLqIvQP000ckMABxG",
);

export default function CheckoutInputs({ cartItems, setFormState, formState }) {
  const [clientSecret, setClientSecret] = useState("");
  const { data: session, status } = useSession();
  const [errors, setErrors] = useState({});

  //  Alapértelmezett state (először üres, vagy localStorage)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    street: "",
    houseNumber: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("formDatas");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  // Adatok lekérése a DB-ből, ha van bejelentkezett session
  useEffect(() => {
    async function fetchUserData() {
      if (status === "authenticated" && session?.user) {
        try {
          const response = await fetch("/api/user-data-fetch");
          if (response.ok) {
            const userData = await response.json();

            setFormData((prev) => ({
              ...prev,
              fullName: userData.name || prev.fullName,
              email: userData.email || prev.email,
              phone: userData.tel || prev.tel,
              city: userData.address?.city || userData.city || prev.city,
              street:
                userData.address?.street || userData.street || prev.street,
              houseNumber:
                userData.address?.houseNumber ||
                userData.houseNumber ||
                prev.houseNumber,
            }));
          }
        } catch (error) {
          console.error(
            "Nem sikerült betölteni a felhasználói adatokat:",
            error,
          );
        }
      }
    }

    fetchUserData();
  }, [session, status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      localStorage.setItem("formDatas", JSON.stringify(updated));
      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleOrder = async () => {
    const newErrors = validateCheckoutForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          cartItems,
          formData,
          userId: session?.user?.userId || "guest",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Hiba részletei:", errorData);
        alert(` ${errorData.error || response.statusText}`);
        return;
      }

      const data = await response.json();

      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setFormState("stripe");
      } else {
        alert("Hiba történt a fizetés indításakor: nincs clientSecret.");
      }
    } catch (error) {
      console.error("Hálózati vagy kliens hiba:", error);
      alert("Nem sikerült kapcsolódni a szerverhez.");
    }
  };

  return (
    <>
      {formState === "form" ? (
        <div className="w-full flex flex-col sticky top-[120px] cart-wrapper p-4 bg-white gap-4 ml-auto shadow-sm border border-gray-200 rounded-lg">
          <h2 className="text-gray-900 text-xl font-bold border-b border-gray-200 pb-3">
            Szállítási adatok
          </h2>
          <form className="flex flex-col gap-3">
            <FloatingInput
              name="fullName"
              label="Név"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />
            <FloatingInput
              name="email"
              label="E-mail cím"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <FloatingInput
              name="phone"
              label="Telefonszám"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
            />
            <FloatingInput
              name="city"
              label="Település"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
            />
            <FloatingInput
              name="street"
              label="Utca"
              value={formData.street}
              onChange={handleChange}
              error={errors.street}
            />
            <FloatingInput
              name="houseNumber"
              label="Házszám"
              type="number"
              min="0"
              value={formData.houseNumber}
              onChange={handleChange}
              error={errors.houseNumber}
            />
          </form>

          <button
            onClick={handleOrder}
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-4 rounded transition-colors text-sm uppercase tracking-wider mt-2"
          >
            Tovább a fizetéshez
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col sticky top-[120px] p-4 bg-white gap-4 ml-auto shadow-sm border border-gray-200 rounded-lg">
          <h2 className="text-gray-900 text-xl font-bold border-b border-gray-200 pb-3 mb-2">
            Bankkártyás fizetés
          </h2>

          {clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: { theme: "stripe", labels: "floating" },
              }}
            >
              <CheckoutStripe formData={formData} cartItems={cartItems} />
            </Elements>
          )}

          <button
            onClick={() => setFormState("form")}
            className="text-gray-500 hover:text-gray-800 text-sm mt-4 underline transition-colors text-center"
          >
            Vissza az adatokhoz
          </button>
        </div>
      )}
    </>
  );
}
