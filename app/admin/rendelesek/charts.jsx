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

  if (loading) {
    return (
      <div className="w-full h-[350px] bg-neutral-800 border border-neutral-700 rounded-2xl flex items-center justify-center">
        <p className="text-teal-500 animate-pulse text-sm">
          Grafikon betöltése...
        </p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-[350px] bg-neutral-800 border border-neutral-700 rounded-2xl flex items-center justify-center">
        <p className="text-gray-400 text-sm">Nincs megjeleníthető adat.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-neutral-800 border border-neutral-700 p-2 rounded-2xl shadow-xl">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white">
          Elmúlt 14 nap analitikája
        </h2>
        <p className="text-xs text-gray-400">
          Rendelések száma és napi bevételek alakulása
        </p>
      </div>

      <div className="h-[350px] w-full ">
        <ResponsiveContainer width="100%" height="100%" min-width="400px">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <CartesianGrid
              stroke="#334155"
              vertical={false}
              padding={{ top: "20px", bottom: "20px" }}
            />
            <XAxis dataKey="datum" stroke="#94a3b8" fontSize={10} />

            {/* Bal tengely a pénznek */}
            <YAxis
              yAxisId="left"
              stroke="#0d9488"
              fontSize={10}
              tickFormatter={(v) => `${v.toLocaleString()} Ft`}
            />

            {/* Jobb tengely a darabszámnak */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#f1c06b"
              fontSize={10}
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
              stroke="#f1c06b"
              strokeWidth={3}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
