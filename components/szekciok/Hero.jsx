import HeroRight from "./HeroJobb";

import { FiClock, FiTruck } from "react-icons/fi";
import { TbTruckDelivery } from "react-icons/tb";

export default function Hero() {
  return (
    <section className="w-[90%] mx-auto  py-12 lg:py-20 flex flex-col md:flex-row justify-between items-center gap-12">
      {/* BAL OLDAL*/}
      <div className="hero-left w-full md:w-[50%] ">
        <div className="space-y-2">
          <span className="text-white font-bold uppercase tracking-widest text-xs sm:text-sm block">
            - Minden nap frissen
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-center md:text-left text-gray-100 tracking-tight leading-tight">
            Heti menü{" "}
            <span className="underlined nowrap text-nowrap">kiszállítás</span>
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-400 italic">
            Mamma Mia Kifőzde
          </h2>
        </div>

        {/* Info Kártyák */}
        <div className="flex flex-row flex-wrap  gap-4 pt-4  mx-auto lg:mx-0">
          <div className="flex items-center w-full sm:w-fit gap-[5px] bg-neutral-800/60 border border-white py-[5px] pl-[10px] pr-[35px] rounded-full shadow-lg">
            <div className="p-[5px] bg-white rounded-full shrink-0 mr-[10px]">
              <TbTruckDelivery
                size={22}
                className="text-black w-[35px] h-[35px]"
              />
            </div>
            <div className="text-center mx-auto">
              <p className="text-[15px] text-gray-400 font-medium">
                Kiszállítás
              </p>
              <div className="w-2/3 h-[3px] rounded-full bg-white/70 flex mx-auto md:mr-auto my-[5px]"></div>
              <p className="text-sm font-bold text-gray-200">
                Hétfőtől - Szombatig
              </p>
            </div>
          </div>

          <div className="flex items-center w-full sm:w-fit gap-[5px] bg-neutral-800/60 border border-white py-[5px] pl-[10px] pr-[35px]  rounded-full shadow-lg">
            <div className="p-[5px] bg-white rounded-full shrink-0 mr-[10px]">
              <FiClock size={22} className="text-black w-[35px] h-[35px]" />
            </div>
            <div className="text-left mx-auto">
              <p className="text-[15px] text-gray-400 font-medium">
                Rendelésfelvétel
              </p>
              <div className="w-2/3 h-[3px] rounded-full bg-white/70 flex mx-auto md:mr-auto my-[5px]"></div>
              <p className="text-sm font-bold text-gray-200">Aznap 12:00-ig</p>
            </div>
          </div>
        </div>

        {/* Tag-ek */}
        <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2 my-[15px]">
          <span className="px-3 py-1 bg-sarga text-white skew-[-5deg]  rounded-md text-[12px] font-medium tracking-wide">
            Hetimenü
          </span>
          <span className="px-3 py-1 bg-sarga text-white skew-[5deg] rounded-md text-[12px] font-medium tracking-wide">
            Kiszállítás
          </span>
          <span className="px-3 py-1 bg-sarga text-white skew-[-5deg] rounded-md text-[12px] font-medium tracking-wide">
            Kedvező ár
          </span>
          <span className="px-3 py-1 bg-sarga text-white skew-[5deg] rounded-md text-[12px] font-medium tracking-wide">
            Házias ízek
          </span>
        </div>
      </div>

      <HeroRight></HeroRight>
    </section>
  );
}
