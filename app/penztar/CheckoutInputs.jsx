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

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    street: "",
    houseNumber: "",
  });

  // Egységesített adatbetöltés: LocalStorage + DB
  useEffect(() => {
    async function loadInitialData() {
      let dataToSet = {};

      // 1. LocalStorage beolvasása
      const saved = localStorage.getItem("formDatas");
      if (saved) {
        try {
          dataToSet = JSON.parse(saved);
        } catch (e) {
          console.error("Hiba a storage betöltésénél", e);
        }
      }

      // 2. Adatbázis (ha van session, ez felülírja/kiegészíti a storage-et)
      if (status === "authenticated" && session?.user) {
        try {
          const response = await fetch("/api/user-data-fetch");
          if (response.ok) {
            const db = await response.json();
            dataToSet = {
              ...dataToSet,
              fullName: db.name || dataToSet.fullName || "",
              email: db.email || dataToSet.email || "",
              phone: db.tel || dataToSet.phone || "",
              city: db.address?.city || db.city || dataToSet.city || "",
              street: db.address?.street || db.street || dataToSet.street || "",
              houseNumber:
                db.address?.houseNumber ||
                db.houseNumber ||
                dataToSet.houseNumber ||
                "",
            };
          }
        } catch (error) {
          console.error("Adatbázis hiba:", error);
        }
      }

      setFormData((prev) => ({ ...prev, ...dataToSet }));
    }

    loadInitialData();
  }, [session, status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      localStorage.setItem("formDatas", JSON.stringify(updated));
      return updated;
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleOrder = async () => {
    const newErrors = validateCheckoutForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
          formData,
          userId: session?.user?.userId || "",
        }),
      });

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setFormState("payment");
      } else {
        alert("Hiba történt a fizetés indításakor:");
      }
    } catch (error) {
      console.error("Hiba:", error);
    }
  };

  return (
    <div className="w-full flex flex-col p-4 bg-white shadow-sm border border-gray-200 rounded-lg">
      {formState === "form" ? (
        <>
          <h2 className="text-gray-900 text-lg font-bold border-b border-gray-100 pb-3 mb-4">
            Szállítási adatok
          </h2>
          <form className="flex flex-col gap-4">
            <FloatingInput
              name="fullName"
              label="Név"
              value={formData.fullName || ""}
              onChange={handleChange}
              error={errors.fullName}
            />
            <FloatingInput
              name="email"
              label="E-mail"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              error={errors.email}
            />
            <FloatingInput
              name="phone"
              label="Telefon"
              type="tel"
              value={formData.phone || ""}
              onChange={handleChange}
              error={errors.phone}
            />
            <FloatingInput
              name="city"
              label="Település"
              value={formData.city || ""}
              onChange={handleChange}
              error={errors.city}
            />
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <FloatingInput
                  name="street"
                  label="Utca"
                  value={formData.street || ""}
                  onChange={handleChange}
                  error={errors.street}
                />
              </div>
              <FloatingInput
                name="houseNumber"
                label="Hsz."
                type="number"
                value={formData.houseNumber || ""}
                onChange={handleChange}
                error={errors.houseNumber}
              />
            </div>
          </form>
          <button
            onClick={handleOrder}
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded transition-colors text-sm uppercase tracking-widest mt-4"
          >
            Tovább a fizetéshez
          </button>
        </>
      ) : (
        <>
          <h2 className="text-gray-900 text-lg font-bold border-b border-gray-100 pb-3 mb-4">
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
            className="text-gray-400 hover:text-black text-xs font-bold uppercase tracking-widest mt-6 underline text-center"
          >
            Vissza az adatokhoz
          </button>
        </>
      )}
    </div>
  );
}
