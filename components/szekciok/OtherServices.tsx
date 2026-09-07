"use client";

import { LiaBirthdayCakeSolid, LiaBriefcaseSolid } from "react-icons/lia";
import { PiStudent } from "react-icons/pi";
import { MdOutlinePeople } from "react-icons/md";
import { IconType } from "react-icons";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: IconType;
  img: string;
}

const services: Service[] = [
  {
    id: "01",
    title: "Születésnapok és névnapok",
    description:
      "Tegye felhőtlenné a születésnapi készülődést! Bőséges sültes- és hidegtálainkkal a vendéglátás gondját leveszzük a válláról.",
    icon: LiaBirthdayCakeSolid,
    img: "/tal1-nobg.png",
  },
  {
    id: "02",
    title: "Ballagás és diplomaosztó",
    description:
      "Ünnepeljék a mérföldköveket prémium minőségű ételtálakkal. Házhoz szállítva, frissen készítve az egész családnak.",
    icon: PiStudent,
    img: "/tal2-nobg.png",
  },
  {
    id: "03",
    title: "Családi összejövetelek",
    description:
      "Keresztelők, évfordulók vagy vasárnapi nagyvendégség? Többszemélyes tálainkkal garantált a házias ízvilág és a bőséges adag.",
    icon: MdOutlinePeople,
    img: "/tal3-nobg.png",
  },
  {
    id: "04",
    title: "Céges rendezvények",
    description:
      "Profi étkezési megoldások céges megbeszélésekre, csapatépítőkre és ünnepi állófogadásokra Kaposváron és környékén.",
    icon: LiaBriefcaseSolid,
    img: "/tal4-nobg.png",
  },
];

export default function OtherServices() {
  const [activeService, setActiveService] = useState<Service | null>(null);

  return (
    <section className="w-[90%] flex flex-col mx-auto my-[50px] relative">
      {/* Kép modal  */}
      <AnimatePresence>
        {activeService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer pt-[100px]"
            onClick={() => setActiveService(null)}
          >
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  ease: [0.7, 0, 0.84, 0],
                },
              }}
              exit={{
                scale: 0.3,
                opacity: 0,

                transition: {
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                },
              }}
              className="relative w-full max-w-[1200px] max-h-[80%] min-h-[350px] my-auto aspect-square bg-transparent p-6 rounded-md flex flex-col items-center justify-center shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveService(null)}
                className="absolute top-4 right-4 text-white text-xl font-bold bg-neutral-800 hover:bg-neutral-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              >
                ✕
              </button>

              {/* Nagy kép */}
              <div className="relative w-[80%] h-[80%]">
                <Image
                  fill
                  alt={activeService.title}
                  src={activeService.img}
                  className="object-contain"
                />
              </div>

              {/* <h3 className="text-[20px] text-neutral-600 mt-4 text-center">
                {activeService.description}
              </h3> */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="text-[32px] font-bold mb-8 text-center md:text-left">
        Többszemélyes ételtálaink különleges alkalmakra
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[50px]">
        {services.map((service) => {
          const IconComponent = service.icon;

          return (
            <div key={service.id} className="flex flex-col w-full">
              {/* Header */}
              <div className="flex flex-row items-center gap-[20px] mb-2">
                <div className="bg-sarga p-[5px] rounded-md relative other-service-icon rotate-[45deg]">
                  <IconComponent
                    size={35}
                    className="text-white rotate-[-45deg]"
                  />
                </div>

                <p className="text-[40px] [-webkit-text-stroke:1px_#ffffff] text-transparent font-black leading-none">
                  {service.id}
                </p>
              </div>

              {/* Tartalom */}
              <h3 className="text-[28px] text-sarga font-black mt-2">
                {service.title}
              </h3>
              <p className="text-neutral-300 mt-1 leading-relaxed">
                {service.description}
              </p>
              <Image
                alt={service.title}
                width={150}
                height={150}
                className="w-[150px] h-[150px] object-contain rounded-full border-2 border-white mt-[15px] cursor-pointer hover:scale-105 transition-transform"
                src={service.img}
                onClick={() => setActiveService(service)}
              />
              <a
                href="/kapcsolat"
                className="rendeles-btn relative flex !text-white w-fit cursor-pointer my-[10px]"
              >
                <p>Megrendelem</p>
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
