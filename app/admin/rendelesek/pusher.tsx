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
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;

    if (!pusherKey || !pusherCluster) {
      console.warn("Pusher kulcsok hiányoznak a környezeti változókból!");
      return;
    }

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
      forceTLS: true,
    });

    const channel = pusher.subscribe("admin-orders");

    const handleNewOrder = () => {
      toast.success("Új rendelés érkezett!");
      setIsModalOpen(true);
    };

    channel.bind("uj-rendeles", handleNewOrder);

    return () => {
      channel.unbind("uj-rendeles", handleNewOrder);
      pusher.unsubscribe("admin-orders");
      pusher.disconnect();
    };
  }, []);

  if (!isModalOpen) return null;

  return (
    <div className="fixed z-50 bottom-[100px] right-[10px] bg-neutral-800 border border-green-400 px-[10px] pt-[35px] rounded-sm w-fit shadow-2xl text-center">
      <button
        title="Értesítés bezárása"
        onClick={() => setIsModalOpen(false)}
        className="absolute flex flex-row items-center justify-center top-[5px] right-[5px] bg-black hover:bg-red-500 text-white p-[10px] rounded-full font-bold transition-all w-[30px] h-[30px]"
      >
        <span className="text-[20px] leading-none">×</span>
      </button>

      <div className="text-[15px] font-bold text-white my-5 flex flex-row items-center gap-[10px]">
        <FaCartPlus size={20} /> Új rendelés érkezett!
      </div>

      <button
        onClick={() => {
          router.refresh();
          setIsModalOpen(false);
        }}
        className="bg-green-400 hover:bg-green-500 text-white p-2 rounded-full mb-2 transition-colors"
        title="Oldal frissítése"
      >
        <VscRefresh size={20} />
      </button>
    </div>
  );
}
