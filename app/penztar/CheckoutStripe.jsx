"use client";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";

// NextAuth session
import { useSession } from "next-auth/react";

// Cart context---------------
import { cartContext } from "@/components/contexts/cartProvider";

export default function CheckoutStripe({ formData, cartItems }) {
  const { clearCart } = useContext(cartContext);

  // NextAuth-tól kérjük el a usert
  const { data: session } = useSession();

  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

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
      clearCart();
      router.push("/fizetve");
    } else {
      setErrorMessage("A fizetés feldolgozása nem fejeződött be sikeresen.");
      setIsProcessing(false);
    }
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
