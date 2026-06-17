import { useEffect, useState } from "react";

export default function PerformantCounter({
  targetValue = 100,
  duration = 5000,
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;

    // Ez a függvény fut le minden egyes képkocka (frame) előtt
    const animateCounter = (timestamp) => {
      if (!startTime) startTime = timestamp;

      // Mennyi idő telt el a kezdés óta ezredmásodpercben
      const elapsed = timestamp - startTime;

      // Kiszámoljuk a haladási arányt (0.0 és 1.0 között)
      // A Math.min garantálja, hogy ne menjünk 1 (azaz 100%) fölé
      const progress = Math.min(elapsed / duration, 1);

      // Kiszámoljuk az aktuális számot az arány alapján, majd kerekítjük
      const currentValue = Math.floor(progress * targetValue);

      // Frissítjük a state-et
      setCount(currentValue);

      // Ha még nem értük el a 100%-ot (progress < 1), kérjük a következő képkockát
      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      }
    };

    // Elindítjuk az animációt
    const animationId = requestAnimationFrame(animateCounter);

    // Takarítás: ha a komponens unmountolódik, leállítjuk az időzítőt
    return () => cancelAnimationFrame(animationId);
  }, [targetValue, duration]);

  return <span className="font-bold text-2xl text-teal-400">{count}</span>;
}
