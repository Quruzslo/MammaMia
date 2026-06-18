"use client";

import { useEffect } from "react";

import Pusher from "pusher-js";
import { toast } from "react-toastify";

export default function PusherComponent() {
  useEffect(() => {
    // Pusher kliens indítása
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
    });

    const channel = pusher.subscribe("admin-orders");

    channel.bind("uj-rendeles", (newOrder: any) => {
      toast.success(`Új rendelés érkezett!`);
      console.log("!!! PUSHER ESEMÉNY BEÉRKEZETT !!!", newOrder);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, []);

  return null;
}
