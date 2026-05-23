// CheckoutStripe.jsx
"use client";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Cart context---------------
import { useContext } from "react";
import { cartContext } from "@/components/contexts/cartProvider";
import { userContext } from "@/components/contexts/userProvider";

export default function CheckoutStripe({ formData, cartItems }) {
  const { clearCart } = useContext(cartContext);
  const { user } = useContext(userContext);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            formData,
            cartItems,
            user,
          }),
        });

        if (response.ok) {
          router.push("/fizetve");
          clearCart();
        } else {
          setErrorMessage("Rendelés mentése sikertelen.");
        }
      } catch (err) {
        console.error("Mentési hiba:", err);
        setErrorMessage("Szerver hiba történt.");
      }
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      {errorMessage && <p className="text-red-400 text-sm">{errorMessage}</p>}
      <button
        disabled={isProcessing || !stripe}
        className="bg-teal-600 text-white p-2 rounded-lg disabled:opacity-50 hover:bg-teal-500 transition-colors"
      >
        {isProcessing ? "Feldolgozás..." : "Fizetés most"}
      </button>
    </form>
  );
}
