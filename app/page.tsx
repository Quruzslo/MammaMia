import Hero from "@/components/szekciok/Hero";
import Menu from "@/components/szekciok/Menu";
import NiceCard from "@/components/szekciok/NiceCard";
import OtherServices from "@/components/szekciok/OtherServices";
export default function App() {
  return (
    <section className="max-w-[1800px] w-[100%] mx-auto h-full justify-center">
      <Hero></Hero>
      <OtherServices></OtherServices>
      <NiceCard></NiceCard>
      <Menu></Menu>
    </section>
  );
}
