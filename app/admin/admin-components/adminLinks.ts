import { TfiStatsUp } from "react-icons/tfi";
import { CiViewList } from "react-icons/ci";
import { FiUpload } from "react-icons/fi";
import { CiBookmarkPlus } from "react-icons/ci";
import { PiBowlFood } from "react-icons/pi";
import { BiFoodMenu } from "react-icons/bi";

export const adminLinks = [
  {
    name: "Rendelések kezelése",
    path: "/admin/rendelesek",
    icon: CiViewList,
  },
  {
    name: "Új rendelés leadása",
    path: "/admin/ujrendeles",
    icon: CiBookmarkPlus,
  },
  {
    name: "Ételek kezelése",
    path: "/admin/etelek",
    icon: PiBowlFood,
  },
  {
    name: "Étlap összeállítása",
    path: "/admin/feltoltes",
    icon: BiFoodMenu,
  },
  {
    name: "Statisztikák",
    path: "/admin/statisztika",
    icon: TfiStatsUp,
  },
];
