"use client";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Home() {
  const [data, setData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    avgPrice: 0,
    cancellations: 0,
  });
  const [loading, setLoading] = useState(true);

  // Colors for Charts
  const COLORS = [
    "#6366f1",
    "#ec4899",
    "#14b8a6",
    "#f59e0b",
    "#8b5cf6",
    "#3b82f6",
  ];

  // Months ki sahi tarteeb (Sorting ke liye)
  const monthOrder = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/stats")
      .then((res) => res.json())
      .then((incomingData) => {
        setData(incomingData);

        // --- 1. CARDS DATA ---
        const total = incomingData.length;
        const avgPrice =
          incomingData.reduce(
            (acc, row) => acc + (parseFloat(row.adr) || 0),
            0,
          ) / total;
        const cancellations = incomingData.filter(
          (row) => row.is_canceled == 1,
        ).length;

        setStats({
          total: total,
          avgPrice: Math.round(avgPrice),
          cancellations: cancellations,
        });

        // --- 2. BAR CHART (SORTED MONTHS) ---
        const monthCounts = {};
        incomingData.forEach((row) => {
          const month = row.arrival_date_month;
          monthCounts[month] = (monthCounts[month] || 0) + 1;
        });

        // Convert to Array & SORT IT
        const sortedBarData = Object.keys(monthCounts)
          .map((key) => ({ name: key, bookings: monthCounts[key] }))
          .sort(
            (a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name),
          );

        setBarData(sortedBarData);

        // --- 3. PIE CHART (ROOM TYPES) ---
        const roomCounts = {};
        incomingData.forEach((row) => {
          const room = row.assigned_room_type;
          roomCounts[room] = (roomCounts[room] || 0) + 1;
        });

        const sortedRooms = Object.keys(roomCounts)
          .map((key) => ({ name: key, value: roomCounts[key] }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5); // Top 5 rooms

        setPieData(sortedRooms);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Connection Error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* HEADER */}
      <div className="mb-8 flex items-center gap-3">
        <span className="text-4xl">🏨</span>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Hotel Analytics Dashboard
          </h1>
          <p className="text-slate-500">
            Real-time booking performance & trends
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {/* --- TOP STATS CARDS --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500">
              <p className="text-slate-500 text-sm font-medium">
                TOTAL BOOKINGS
              </p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">
                {stats.total}
              </h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-green-500">
              <p className="text-slate-500 text-sm font-medium">
                AVG. DAILY RATE
              </p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">
                ${stats.avgPrice}
              </h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-red-500">
              <p className="text-slate-500 text-sm font-medium">
                CANCELLATIONS
              </p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">
                {stats.cancellations}
              </h3>
            </div>
          </div>

          {/* --- CHARTS SECTION --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Bar Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-700 mb-6">
                📅 Monthly Trends (Jan - Dec)
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-30}
                      textAnchor="end"
                    />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: "#f1f5f9" }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar
                      dataKey="bookings"
                      fill="#6366f1"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-700 mb-6">
                🏠 Popular Room Types
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
