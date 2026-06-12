"use client";
import { useContext } from "react";
import { cartContext } from "@/components/contexts/cartProvider";
import Link from "next/link";

// Ikonok----------------
import { BsTrash } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";

export default function SideCart() {
  const {
    cartItems,
    sideCartState,
    animateSideCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
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
    <section
      className={`h-screen w-full fixed left-0 top-0 bg-neutral-800/50 cart-overlay z-[40] transition-all duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] ${
        sideCartState ? "active " : null
      }`}
      onClick={animateSideCart}
    >
      <div
        className="cart-wrapper p-4 bg-neutral-900 flex flex-col gap-4 ml-auto w-[80%] md:w-[50%] lg:w-[40%] h-full overflow-auto pt-[100px] shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] transform"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row justify-between border-b border-white pb-2 w-full p-2 items-center">
          <h2 className="text-white/70 font-bold text-xl">Kosár tartalma</h2>
          {cartItems.length > 0 ? (
            <div
              onClick={() => clearCart()}
              className=" rounded-[9px] cursor-grab group rounded border-[2px] p-[2px]  border-transparent hover:border-red-400 "
            >
              <div className="px-2 py-1 bg-red-300/50 rounded-[5px] group-hover:bg-red-600 ">
                <span className="text-teal-100">Kiürítés</span>
              </div>
            </div>
          ) : null}
        </div>
        {cartItems.length === 0 ? (
          <p className="text-teal-100/50 text-center mt-10 italic">
            A kosarad még üres...
          </p>
        ) : (
          cartItems
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((nap) => (
              // --- KÜLSŐ CIKLUS: NAPOK ---
              <div
                key={nap.date}
                className="bg-neutral-800 rounded-[5px]   mb-2  "
              >
                <div className="bg-white p-2 flex justify-between items-center rounded-[3px]">
                  <span className="text-black font-bold">{nap.dayName}</span>
                  <span className="text-[10px] text-black">{nap.date}</span>
                </div>

                <div className="p-2 flex flex-col gap-3">
                  {nap.items.map((etel, index) => (
                    <div
                      key={`${nap.date}-${etel.name}`}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-700 last:border-0 pb-3 sm:pb-2 gap-3"
                    >
                      <div className="flex flex-col">
                        <p className="text-sm text-teal-50 font-medium leading-tight">
                          {etel.name}
                        </p>
                        <p className="text-xs text-white">{etel.price} Ft</p>
                      </div>

                      {/* A gombok tárolója */}
                      <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                        <div className="flex items-center gap-1 sm:gap-1 md:gap-3">
                          <div className="flex items-center gap-1">
                            <button
                              className="p-1 border border-white rounded-full"
                              onClick={() =>
                                updateItemQuantity(etel.name, nap.date, 1)
                              }
                            >
                              <FiPlus size={16} className="stroke-white" />
                            </button>
                            <div className="bg-black/70 text-white/70 px-2 py-1 rounded text-xs font-bold min-w-[45px] text-center">
                              {etel.quantity} db
                            </div>
                            <button
                              className="p-1 border border-white rounded-full"
                              onClick={() =>
                                updateItemQuantity(etel.name, nap.date, -1)
                              }
                            >
                              <FiMinus size={16} className="stroke-white" />
                            </button>
                          </div>
                        </div>

                        <div
                          onClick={() => removeFromCart(etel, nap.date)}
                          className=" cursor-pointer flex items-center gap-3 px-2 py-1 rounded border border-red-300/50 hover:border-red-600 group"
                        >
                          <button className="p-1">
                            <BsTrash
                              size={14}
                              className="fill-red-300 group-hover:fill-red-600"
                            />
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
          <div className="flex flex-col md:flex-row gap-2 md:gap-0 justify-center items-center mt-auto border-t border-white pt-[15px]">
            <div className="items-center justify-center flex flex-row w-[100%] md:w-[50%]">
              <p className="text-white">Összesen: {totalItemsPrice} Ft.</p>
            </div>
            <div className="items-center justify-center flex flex-row w-[100%] md:w-[50%]">
              <Link href="/penztar">
                <button
                  onClick={animateSideCart}
                  className="mt-auto w-full  hover:bg-white text-white  hover:text-black border border-white font-black py-3 rounded-md transition-colors px-4"
                >
                  Tovább a fizetéshez
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
