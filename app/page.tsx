import Hero from "@/components/szekciok/Hero";
import Menu from "@/components/szekciok/Menu";
export default function App() {
  return (
    <section className="max-w-[1800px] w-[100%] md:w-[80%] mx-auto h-full justify-center p-[10px]">
      <Hero></Hero>
      <Menu></Menu>
    </section>
  );
}
