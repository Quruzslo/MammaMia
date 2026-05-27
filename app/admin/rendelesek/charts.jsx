"use client";

import { useState, useEffect } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function AdminCharts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");

        if (!res.ok) {
          throw new Error("Hiba történt az adatok lekérésekor");
        }

        const statsData = await res.json();
        setData(statsData);
      } catch (error) {
        console.error("Grafikon hiba:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // 1. Töltési állapot a grafikon dobozán belül
  if (loading) {
    return (
      <div className="w-full h-[350px] bg-neutral-800 border border-neutral-700 rounded-2xl flex items-center justify-center">
        <p className="text-teal-500 animate-pulse text-sm">
          Grafikon betöltése...
        </p>
      </div>
    );
  }

  // 2. Ha nincs adat, ne üres semmit mutassunk
  if (data.length === 0) {
    return (
      <div className="w-full h-[350px] bg-neutral-800 border border-neutral-700 rounded-2xl flex items-center justify-center">
        <p className="text-gray-400 text-sm">
          Nincs megjeleníthető adat az elmúlt 14 napban.
        </p>
      </div>
    );
  }

  // 3. A kész grafikon kirajzolása
  return (
    <div className="w-full bg-neutral-800 border border-neutral-700 p-6 rounded-2xl shadow-xl">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white">
          Elmúlt 14 nap analitikája
        </h2>
        <p className="text-xs text-gray-400">
          Rendelések száma és napi bevételek alakulása
        </p>
      </div>

      <div className="h-[350px] w-full ">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} padding={{ top: "20px", bottom: "20px" }}>
            <CartesianGrid stroke="#334155" vertical={false} />
            <XAxis dataKey="datum" stroke="#94a3b8" fontSize={11} />

            {/* Bal tengely a pénznek */}
            <YAxis
              yAxisId="left"
              stroke="#0d9488"
              fontSize={11}
              tickFormatter={(v) => `${v.toLocaleString()} Ft`}
            />

            {/* Jobb tengely a darabszámnak */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#f59e0b"
              fontSize={11}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                borderColor: "#475569",
                borderRadius: "12px",
              }}
            />
            <Legend />

            <Bar
              yAxisId="left"
              dataKey="bevetel"
              name="Bevétel"
              fill="#0d9488"
              radius={[4, 4, 0, 0]}
              maxBarSize={35}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="rendelesSzam"
              name="Rendelések"
              stroke="#f59e0b"
              strokeWidth={3}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
