import { LiaBirthdayCakeSolid, LiaBriefcaseSolid } from "react-icons/lia";
import { PiStudent } from "react-icons/pi";
import { MdOutlinePeople } from "react-icons/md";
import Image from "next/image";

const services = [
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
  return (
    <section className="w-[90%] flex flex-col mx-auto my-[50px]">
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
                alt={service.description}
                width={100}
                height={100}
                className="w-[150px] h-[150px]  object-contain rounded-full border-2 border-white mt-[15px]"
                src={service.img}
              ></Image>
            </div>
          );
        })}
      </div>
      <div></div>
    </section>
  );
}
