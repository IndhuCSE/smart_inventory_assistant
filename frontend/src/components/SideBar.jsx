import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png"; // Replace with your actual logo

export default function Sidebar() {
  const handleDownload = () => {
    const token = localStorage.getItem("token");
    const url = "http://127.0.0.1:8000/inventory/report?format=csv";

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to download report");
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "inventory_report.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((err) => {
        alert(err.message || "Download failed");
      });
  };

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg font-medium text-m ${
      isActive
        ? "bg-blue-100 text-gray-600"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="h-screen w-64 bg-white shadow-md fixed top-0 left-0 flex flex-col justify-between">
      {/* Logo + Navs */}
      <div>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
          <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
          <span className="text-xl font-bold text-gray-800">StockSync</span>
        </div>

        <nav className="flex flex-col p-4 space-y-2">
          <NavLink to="/home/dashboard" className={navLinkClass}>Dashboard</NavLink>
          <NavLink to="/home/inventory" className={navLinkClass}>Inventory</NavLink>
          <NavLink to="/home/stafflist" className={navLinkClass}>Staff list</NavLink>
          <NavLink to="/home/register" className={navLinkClass}>ADD user</NavLink>
        </nav>
      </div>

      {/* Download at bottom with margin */}
      <div className="p-4 mb-[15px]">
        <button
          onClick={handleDownload}
          className="w-full px-4 py-2 rounded-lg font-medium text-m text-gray-700 hover:bg-gray-100"
        >
          Download Report
        </button>
      </div>
    </div>
  );
}
