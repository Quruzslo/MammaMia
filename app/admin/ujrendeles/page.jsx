"use client";

import { useState, useContext } from "react"; // Hozzáadva: useContext
import { cartContext } from "@/components/contexts/cartProvider"; // Hozzáadva: a kosár context elérése
import { validateCheckoutForm } from "../../../utils/validateCheckoutForm.js";
import AdminNav from "../rendelesek/adminNav.jsx";
import CheckoutOrders from "../../penztar/CheckoutOrders.jsx";
import FloatingInput from "../../penztar/FloatingInput.jsx";
import { useSession } from "next-auth/react";

export default function CheckoutAdminInputs() {
  const { data: session } = useSession();
  const [errors, setErrors] = useState({});

  const { cartItems, clearCart } = useContext(cartContext);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    street: "",
    houseNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      return updated;
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleOrder = async () => {
    const newErrors = validateCheckoutForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch("/api/create-admin-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems, // Most már garantáltan a context-ből vett tömb megy el, nem undefined!
          formData,
          userId: "admin",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Rendelés sikeresen rögzítve!");

        // Form és localStorage ürítése a következő rendeléshez
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          city: "",
          street: "",
          houseNumber: "",
        });
        localStorage.removeItem("formDatas");
        clearCart();
      } else {
        alert(
          `Hiba történt a rendelés leadásakor: ${data.error || "Ismeretlen hiba"}`,
        );
      }
    } catch (error) {
      console.error("Hiba:", error);
      alert("Hálózati hiba történt.");
    }
  };

  return (
    <section className="py-6 px-4 w-[100%] mx-auto min-h-screen bg-neutral-900 text-gray-100 flex flex-col md:flex-row gap-3">
      <div className="flex flex-col gap-3 mb-[35px] w-[100%] md:w-[300px] ">
        <AdminNav />
      </div>

      <div className="flex flex-col md:flex-row gap-3 justify-center w-[100%]">
        <div className="w-[100%] flex flex-col p-4 bg-white shadow-sm border border-gray-200 rounded-sm md:w-[50%] h-fit mx-auto">
          <h2 className="text-gray-900 text-lg font-bold border-b border-gray-100 pb-3 mb-4">
            Vásárló adatai
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
            Rendelés mentése
          </button>
        </div>
        <div className="w-[100%] md:w-[50%] h-fit">
          <CheckoutOrders cartItems={cartItems}></CheckoutOrders>
        </div>
      </div>
    </section>
  );
}
