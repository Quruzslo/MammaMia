"use client";
import { useContext } from "react";
import { cartContext } from "@/components/contexts/cartProvider";
import Link from "next/link";

// Ikonok----------------
import { BsTrash } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";
import { MdOutlineRestaurantMenu } from "react-icons/md";

export default function CheckoutOrders({ expiredItem }) {
  const {
    cartItems,
    // sideCartState,
    // animateSideCart,
    // removeFromCart,
    // updateItemQuantity,
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
      className="cart-wrapper p-4 bg-white flex flex-col gap-4 ml-auto w-[100%] md:w-[100%] h-full overflow-auto shadow-sm border border-gray-200 rounded-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-gray-900 font-bold text-xl border-b border-gray-200 pb-3">
        Rendelés összegzése
      </h2>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <p className="text-gray-500 text-center italic">
            A kosarad még üres...
          </p>
          <Link href="/">
            <div className="checkout-btn-menu-wrapper px-6 py-2.5 bg-black hover:bg-gray-800 transition-colors mx-auto rounded flex flex-row items-center gap-3 cursor-pointer">
              <p className="checkout-btn-menu-text text-white font-bold uppercase tracking-widest text-sm">
                Étlap
              </p>
              <MdOutlineRestaurantMenu
                size={20}
                className="fill-white checkout-btn-menu-icon"
              />
            </div>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {cartItems.map((nap) => (
            // KÜLSŐ CIKLUS
            <div
              key={nap.date}
              className={`rounded-sm border border-gray-200 overflow-hidden ${
                nap.date === expiredItem ? "bg-red-600/50" : "bg-white"
              }`}
            >
              <div className="bg-gray-300 px-3 py-2 border-b border-gray-200 flex justify-between items-center">
                <span className="text-gray-800 font-semibold text-sm uppercase tracking-wide flex flex-row">
                  {nap.dayName}{" "}
                  {expiredItem === nap.date ? (
                    <p className="text-red-600 text-bold ml-[10px]">Lejárt</p>
                  ) : null}
                </span>
                <span className="text-[11px] font-medium text-gray-500">
                  {nap.date}
                </span>
              </div>

              <div className="p-3 flex flex-col gap-3">
                {nap.items.map((etel, _) => (
                  // BELSŐ CIKLUS
                  <div
                    key={`${nap.date}-${etel.name}`}
                    className="flex flex-row justify-between items-start border-b border-gray-100 last:border-0 pb-3 last:pb-0"
                  >
                    <div className="flex flex-col max-w-[65%]">
                      <p className="text-sm text-black font-black">
                        {etel.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {etel.price} Ft
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold border border-gray-200 whitespace-nowrap">
                        {etel.quantity} db
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex justify-between items-end">
            <p className="text-gray-500 font-medium text-sm mb-1">
              Fizetendő összesen(ÁFA-t tartalmazza):
            </p>
            <p className="text-gray-900 text-xl font-bold">
              {totalItemsPrice} Ft
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
