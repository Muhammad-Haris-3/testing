"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/stats")
      .then((res) => res.json())
      .then((incomingData) => {
        setData(incomingData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Connection Error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* 1. Header Card with Margin/Padding */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 border-l-8 border-blue-600">
        <h2 className="text-3xl font-extrabold text-gray-800">
          📊 Booking Analytics
        </h2>
        <p className="text-gray-500 mt-2 text-lg">
          Detailed view of hotel reservation data.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
      ) : (
        // 2. Main Table Container with Shadow and Radius
        <div className="overflow-x-auto shadow-2xl rounded-lg">
          <table className="min-w-full bg-white border-collapse border border-gray-200">
            {/* Table Head (Dark Blue) */}
            <thead className="bg-blue-800 text-white">
              <tr>
                {data.length > 0 &&
                  Object.keys(data[0]).map((key) => (
                    <th
                      key={key}
                      className="py-4 px-6 text-left text-sm font-bold uppercase tracking-wider border-r border-blue-700 last:border-r-0"
                    >
                      {key.replace(/_/g, " ")}
                    </th>
                  ))}
              </tr>
            </thead>

            {/* Table Body with Borders & Zebra Stripes */}
            <tbody className="text-gray-700 text-sm">
              {data.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-blue-100 transition duration-150 even:bg-gray-50"
                >
                  {Object.values(row).map((val, i) => (
                    <td
                      key={i}
                      className="py-3 px-6 border-r border-gray-200 last:border-r-0 whitespace-nowrap"
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
