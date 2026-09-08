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
      className={`h-screen w-full fixed left-0 top-0 bg-stone-900/60 backdrop-blur-sm cart-overlay z-[40] transition-all duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] ${
        sideCartState ? "active " : ""
      }`}
      onClick={animateSideCart}
    >
      <div
        className="cart-wrapper p-4 md:p-6 bg-stone-50 flex flex-col gap-4 ml-auto w-[85%] md:w-[50%] lg:w-[40%] h-full overflow-auto  shadow-[-10px_0_30px_rgba(0,0,0,0.5)] transition-all duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fejléc */}
        <div className="flex flex-row justify-between  pb-4 w-full items-center mt-[120px]">
          <h2 className="text-stone-900 font-black uppercase  text-xl">
            Kosár tartalma
          </h2>
          {cartItems.length > 0 && (
            <button
              onClick={() => clearCart()}
              className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white bg-red-700 rounded-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            >
              Kiürítés
            </button>
          )}
        </div>

        {/* Üres kosár állapota */}
        {cartItems.length === 0 ? (
          <p className="text-stone-600 text-center mt-10 font-medium ">
            A kosarad még üres...
          </p>
        ) : (
          <div className="flex flex-col gap-6 mt-4">
            {cartItems
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((nap) => (
                // --- KÜLSŐ CIKLUS: NAPOK ---
                <div
                  key={nap.date}
                  className="relative bg-white rounded-sm border border-stone-200 p-[10px] shadow-[0_4px_15px_rgba(0,0,0,0.03)]"
                >
                  {/* Dátum badge (a kártyákhoz hasonló stílus) */}
                  <div className=" w-fit bg-stone-900 text-white px-4 py-1.5 rounded-sm shadow-md z-10 border border-dashed border-stone-600 transition-transform hover:rotate-0">
                    <span className="block text-sm font-black uppercase tracking-widest leading-none">
                      {nap.dayName}
                    </span>
                    <span className="block text-[10px] text-stone-300 font-medium tracking-wider mt-1">
                      {nap.date}
                    </span>
                  </div>

                  {/* Ételek listája */}
                  <div className="flex flex-col gap-3 mt-2">
                    {nap.items.map((etel, index) => (
                      <div
                        key={`${nap.date}-${etel.name}`}
                        className="flex flex-col xl:flex-row justify-between items-start xl:items-center border-b border-stone-100 last:border-0 pb-4 xl:pb-3 gap-3"
                      >
                        <div className="flex flex-col">
                          <p className="text-sm md:text-base font-bold text-stone-800 leading-tight">
                            {etel.name}
                          </p>
                          <p className="text-[14px] text-stone-700 font-bold mt-1">
                            {etel.price.toLocaleString()} Ft
                          </p>
                        </div>

                        {/* Mennyiség módosító  */}
                        <div className="flex items-center justify-between w-full xl:w-auto gap-4 mt-1 xl:mt-0">
                          <div className="flex flex-row nowrap bg-white rounded-full items-center px-2 py-1 gap-[10px] border border-sarga">
                            <div className="flex flex-row text-black gap-[5px] items-center">
                              <button
                                className="rounded-full w-[22px] h-[22px] flex items-center justify-center text-white bg-sarga  transition-transform"
                                onClick={() =>
                                  updateItemQuantity(etel.name, nap.date, -1)
                                }
                              >
                                <FiMinus size={12} strokeWidth={4} />
                              </button>
                              <span className="font-bold text-sm min-w-[16px] text-center text-stone-800">
                                {etel.quantity}
                              </span>
                              <button
                                className="rounded-full w-[22px] h-[22px] flex items-center justify-center text-white bg-sarga  transition-transform"
                                onClick={() =>
                                  updateItemQuantity(etel.name, nap.date, 1)
                                }
                              >
                                <FiPlus size={12} strokeWidth={4} />
                              </button>
                            </div>
                          </div>

                          {/* Törlés gomb */}
                          <button
                            onClick={() => removeFromCart(etel, nap.date)}
                            className="p-[8px] flex items-center justify-center rounded-full bg-red-700 text-red-50 hover:bg-red-900 hover:text-white transition-all duration-200 group"
                            title="Törlés"
                          >
                            <BsTrash size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Lábjegyzet (Összesítő és Fizetés) */}
        {cartItems.length > 0 && (
          <div className="flex flex-col gap-4 mt-auto border-t border-stone-200 pt-5 pb-4">
            <div className="flex justify-between items-center px-2">
              <span className="text-stone-500 font-bold uppercase tracking-wider text-xs">
                Fizetendő:
              </span>
              <span className="text-stone-900 font-black text-xl md:text-2xl">
                {totalItemsPrice.toLocaleString()} Ft
              </span>
            </div>

            <Link href="/penztar" className="w-full">
              <button
                onClick={animateSideCart}
                className="w-full bg-stone-900 text-white hover:bg-sarga font-black uppercase tracking-widest py-4 rounded-sm transition-all duration-300 shadow-md hover:-translate-y-1 text-sm"
              >
                Tovább a fizetéshez
              </button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
