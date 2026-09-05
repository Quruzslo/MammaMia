import { IconType } from "react-icons";
import {
  FaWheatAwn,
  FaCow,
  FaFish,
  FaEgg,
  FaShrimp,
  FaSeedling,
} from "react-icons/fa6";

import { LuNut, LuBean } from "react-icons/lu";

export interface AllergenItem {
  id: string;
  name: string;
  icon: IconType;
}

const ALLERGEN_LIST: AllergenItem[] = [
  { id: "gluten", name: "Glutén", icon: FaWheatAwn },
  { id: "laktoz", name: "Laktóz", icon: FaCow },
  { id: "tojas", name: "Tojás", icon: FaEgg },
  { id: "hal", name: "Hal", icon: FaFish },
  { id: "mogyoro", name: "Mogyoró", icon: LuNut },
  { id: "csonthejas", name: "Csonthéjas", icon: LuNut },
  { id: "szoja", name: "Szója", icon: LuBean },
  { id: "rakfelek", name: "Rákfélék", icon: FaShrimp },
  { id: "szezam", name: "Szezámmag", icon: FaSeedling },
];

export default ALLERGEN_LIST;
