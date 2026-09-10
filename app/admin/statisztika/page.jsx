import AdminCharts from "./charts";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import FoodCounter from "./foodCounter";

import PanelSchema from "../admin-components/PanelSchema";

export default async function StatsPage() {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    redirect("/admin");
  }
  return (
    <PanelSchema>
      <AdminCharts></AdminCharts>
      <FoodCounter></FoodCounter>
    </PanelSchema>
  );
}
