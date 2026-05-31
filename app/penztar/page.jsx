"use client";
import { useState } from "react";
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
  return (
    <>
      <section className="mt-[50px] align-center justify-center flex bg-teal-950 max-w-[1800px] w-[90%] md:w-[80%] mx-auto ">
        {" "}
        {formState === "form" ? (
          <h1 className="text-[30px] rounded-lg shadow uppercase  text-white text-center ">
            Pénztár
          </h1>
        ) : (
          <h1 className="text-[30px] rounded-lg shadow uppercase  text-white text-center ">
            Fizetés
          </h1>
        )}
      </section>
      <section className="flex flex-col md:flex-row gap-2 max-w-[1800px] w-[90%] md:w-[80%] mx-auto my-[50px]">
        <div className=" w-[100%] md:w-[50%]">
          <CheckoutInputs
            cartItems={cartItems}
            setFormState={settingFormState}
            formState={formState}
          ></CheckoutInputs>
        </div>
        <div className="w-[100%] md:w-[50%]">
          <CheckoutOrders></CheckoutOrders>
        </div>
      </section>
    </>
  );
}
