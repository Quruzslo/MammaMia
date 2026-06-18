"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { toast } from "react-toastify";

export default function PusherComponent() {
  const router = useRouter();

  useEffect(() => {
    // Pusher kliens indítása
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
    });

    const channel = pusher.subscribe("admin-orders");

    channel.bind("uj-rendeles", (newOrder: any) => {
      toast.success(`Új rendelés érkezett!`);

      // router.refresh();
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [router]);

  return null;
}
