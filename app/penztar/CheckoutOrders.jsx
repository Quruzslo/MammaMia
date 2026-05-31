"use client";
import { useContext } from "react";
import { cartContext } from "@/components/contexts/cartProvider";
import Link from "next/link";

// Ikonok----------------
import { BsTrash } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";
import { MdOutlineRestaurantMenu } from "react-icons/md";

export default function CheckoutOrders() {
  const {
    cartItems,
    sideCartState,
    animateSideCart,
    removeFromCart,
    updateItemQuantity,
  } = useContext(cartContext);
  //   Kosárösszeg kiszámítása ---------
  const totalItemsPrice = cartItems.reduce((totalSum, day) => {
    const daySum = day.items.reduce(
      (acc, food) => acc + food.price * food.quantity,
      0,
    );
    return totalSum + daySum;
  }, 0);

  return (
    <div
      className="cart-wrapper p-4 bg-neutral-900 flex flex-col gap-4 ml-auto w-[100%] md:w-[100%] h-full overflow-auto  shadow-2xl rounded-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-teal-500 font-bold text-xl border-b border-teal-800 pb-2">
        Rendelés összegzése
      </h2>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 ">
          <p className="text-teal-100/50 text-center mt-10 italic">
            A kosarad még üres...
          </p>
          <Link href="/">
            <div className=" checkout-btn-menu-wrapper p-2 bg-teal-600  mx-auto  rounded flex flex-row gap-3">
              <p className="checkout-btn-menu-text text-neutral-900 font-bold uppercase tracking-widest">
                Étlap{" "}
              </p>
              <MdOutlineRestaurantMenu
                size={24}
                className="stroke-neutral-900 checkout-btn-menu-icon"
              />
            </div>
          </Link>
        </div>
      ) : (
        cartItems.map((nap) => (
          // --- KÜLSŐ CIKLUS: NAPOK ---
          <div
            key={nap.date}
            className="bg-neutral-800 rounded-lg border border-teal-900  mb-2"
          >
            <div className="bg-teal-950 p-2 border-b border-teal-900 flex justify-between items-center rounded-lg">
              <span className="text-teal-400 font-bold">{nap.dayName}</span>
              <span className="text-[10px] text-teal-600">{nap.date}</span>
            </div>

            <div className="p-2 flex flex-col gap-3">
              {nap.items.map((etel, index) => (
                // --- BELSŐ CIKLUS: ÉTELEK AZ ADOTT NAPON ---
                <div
                  key={`${nap.date}-${etel.name}`}
                  className="flex flex-row justify-between items-center border-b border-neutral-700 last:border-0 pb-2"
                >
                  <div className="flex flex-col max-w-[50%]">
                    <p className="text-sm text-teal-50 font-medium">
                      {etel.name}
                    </p>
                    <p className="text-xs text-teal-500">{etel.price} Ft</p>
                  </div>

                  <div className="flex items-center gap-2 max-w-[50%]">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateItemQuantity(etel.name, nap.date, 1)
                        }
                      >
                        <FiPlus size={14} className="stroke-teal-300" />
                      </button>
                      <button
                        onClick={() =>
                          updateItemQuantity(etel.name, nap.date, -1)
                        }
                      >
                        <FiMinus size={14} className="stroke-teal-300" />
                      </button>
                    </div>
                    <div className="bg-teal-900/40 text-teal-300 px-2 py-1 rounded text-xs font-bold border border-teal-800 flex-nowrap">
                      {etel.quantity} db
                    </div>
                    <div className="flex items-center gap-3 px-2 py-1 rounded border border-red-300">
                      <button onClick={() => removeFromCart(etel, nap.date)}>
                        <BsTrash size={14} className="fill-red-300" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {cartItems.length > 0 && (
        <div className="flex flex-col gap-2 justify-center items-center mt-auto">
          <p className="text-teal-500">Összesen: {totalItemsPrice} Ft.</p>
        </div>
      )}
    </div>
  );
}
