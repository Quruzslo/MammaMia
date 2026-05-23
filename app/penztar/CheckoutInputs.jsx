// CheckoutInputs.jsx
"use client";
import { useState } from "react";
import { validateCheckoutForm } from "../../utils/validateCheckoutForm.js";
import CheckoutStripe from "./CheckoutStripe.jsx";
import FloatingInput from "./FloatingInput.jsx";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51TU3e2GXOLsnJNTFtaucBVNqDIZkGg4Kr5tZPdEVc6nt6BalUxTK9JgkW4S7grTRgBchl3KSfpkFQ9Nw1lLqIvQP000ckMABxG",
);

export default function CheckoutInputs({ cartItems, setFormState, formState }) {
  const [clientSecret, setClientSecret] = useState("");
  const [formData, setFormData] = useState(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("formDatas") : null;
    return saved
      ? JSON.parse(saved)
      : {
          fullName: "",
          email: "",
          phone: "",
          city: "",
          street: "",
          houseNumber: "",
        };
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
    localStorage.setItem("formDatas", JSON.stringify(formData));
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
        body: JSON.stringify({ cartItems }),
      });

      // Ha a szerver nem 200-as státuszt küld (pl. 400 vagy 500), itt elkapjuk
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Szerver hiba részletei:", errorData);
        alert(`Szerver hiba: ${errorData.error || response.statusText}`);
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
        <div className="w-full flex flex-col sticky top-[120px] cart-wrapper p-4 bg-neutral-900 gap-4 ml-auto shadow-2xl rounded-lg">
          <h2 className="text-teal-50 text-xl font-bold">Szállítási adatok</h2>
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
            className="text-teal-300 mt-4 border-2 border-teal-900 rounded-lg p-2 hover:bg-teal-900/30 transition-colors"
          >
            Tovább a fizetéshez
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col sticky top-[120px] p-4 bg-neutral-900 gap-4 ml-auto shadow-2xl rounded-lg">
          <h2 className="text-teal-50 text-xl font-bold mb-4">
            Bankkártyás fizetés
          </h2>

          {clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: { theme: "night", labels: "floating" },
              }}
            >
              <CheckoutStripe formData={formData} cartItems={cartItems} />
            </Elements>
          )}

          <button
            onClick={() => setFormState("form")}
            className="text-teal-500 text-sm mt-4 underline"
          >
            Vissza az adatokhoz
          </button>
        </div>
      )}
    </>
  );
}
