"use client";

import { useEffect, useState } from "react";
import { FaCartPlus } from "react-icons/fa";
import { VscRefresh } from "react-icons/vsc";
import { useRouter } from "next/navigation";

import Pusher from "pusher-js";
import { toast } from "react-toastify";

export default function PusherModalComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
    });

    const channel = pusher.subscribe("admin-orders");

    channel.bind("uj-rendeles", (newOrder: any) => {
      // 1. Toast
      toast.success(`Új rendelés érkezett!`);
      setIsModalOpen(true);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  if (!isModalOpen) return null;

  return (
    <div className="fixed z-11 bottom-[100px] right-[10px] bg-neutral-800 border border-green-400 px-[10px] pt-[35px] rounded-sm w-fit shadow-2xl text-center">
      <button
        title="Értesítés bezárása"
        onClick={() => setIsModalOpen(false)}
        className="absolute flex flex-row items-center justify-center top-[5px] right-[5px] bg-black hover:bg-red-500 text-white p-[10px] rounded-full font-bold transition-all w-[30px] h-[30px]"
      >
        <p className="text-[20px] m-0 p-0 h-fit w-fit">x</p>
      </button>

      <div className="text-[15px] font-bold text-white my-5 flex flex-row nowrap gap-[10px]">
        {" "}
        <FaCartPlus size={20} /> Új rendelés érkezett!
      </div>

      <button
        onClick={() => {
          router.refresh();
          setIsModalOpen(false);
        }}
        className="bg-green-400 text-white p-2 rounded-full mb-2"
        title="Oldal frissítése"
      >
        <VscRefresh size={20} />
      </button>
    </div>
  );
}
