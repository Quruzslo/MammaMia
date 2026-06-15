"use client";
import { useState } from "react";
import Link from "next/link";
import CheckoutInputs from "./CheckoutInputs";
import CheckoutOrders from "./CheckoutOrders";
import { useContext } from "react";
import { cartContext } from "@/components/contexts/cartProvider";

export default function Checkout() {
  const { cartItems } = useContext(cartContext);
  const [formState, setFormState] = useState("form");
  const settingFormState = (state) => {
    setFormState(state);
  };

  const [expiredItem, setExpiredItem] = useState("");

  return (
    <>
      <section className="mt-[50px] align-center justify-center flex  max-w-[1800px] w-[90%] md:w-[80%] mx-auto gap-2 md:gap-3 ">
        {/* Étlap */}
        <div
          className={`rounded-l-sm p-[10px] pr-[35px] transition-colors duration-300 
              bg-white text-black
          `}
          style={{
            clipPath: "polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)",
          }}
        >
          <Link
            className="text-[15px] md:text-[30px] uppercase font-bold text-center tracking-wide"
            href="/"
          >
            Étlap
          </Link>
        </div>
        {/* pénztár NYÍL */}
        <div
          className={`rounded-l-sm p-[10px] pr-[35px] transition-colors duration-300 ${
            formState === "form"
              ? "bg-teal-600 text-white"
              : "bg-white text-black "
          }`}
          style={{
            clipPath: "polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)",
          }}
        >
          <h2 className="text-[15px] md:text-[30px] uppercase font-bold text-center tracking-wide">
            Pénztár
          </h2>
        </div>
        {/* FIZETÉS NYÍL */}
        <div
          className={`rounded-l-sm p-[10px] pr-[35px] transition-colors duration-300 ${
            formState !== "form"
              ? "bg-teal-600 text-white"
              : "bg-white text-black "
          }`}
          style={{
            clipPath: "polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)",
          }}
        >
          <h2 className=" text-[15px] md:text-[30px] uppercase font-bold text-center tracking-wide">
            Fizetés
          </h2>
        </div>
      </section>
      <section className="flex flex-col md:flex-row gap-2 max-w-[1800px] w-[90%] md:w-[80%] mx-auto my-[50px]">
        <div className=" w-[100%] md:w-[50%]">
          <CheckoutInputs
            cartItems={cartItems}
            setFormState={settingFormState}
            formState={formState}
            setExpiredItem={setExpiredItem}
          ></CheckoutInputs>
        </div>
        <div className="w-[100%] md:w-[50%]">
          <CheckoutOrders expiredItem={expiredItem}></CheckoutOrders>
        </div>
      </section>
    </>
  );
}
