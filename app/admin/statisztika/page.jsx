import AdminNav from "../rendelesek/adminNav";
import AdminCharts from "./charts";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function StatsPage() {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    redirect("/admin");
  }
  return (
    <section className="py-6 px-4 w-[100%] gap-3  mx-auto min-h-screen bg-neutral-900 text-gray-100  flex flex-col md:flex-row">
      <div className="w-[100%] md:w-[300px]">
        <AdminNav></AdminNav>{" "}
      </div>
      <div className="bg-neutral-900 mx-auto w-[100%] max-w-[1800px] mx-auto">
        <AdminCharts></AdminCharts>
      </div>
    </section>
  );
}
