import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png"; // Replace with your actual logo

export default function Sidebar() {
  return (
    <div className="h-screen w-64 bg-white shadow-md fixed top-0 left-0 flex flex-col">
      {/* Logo + Company Name */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
        <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
        <span className="text-xl font-bold text-gray-800">StockSync</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col p-4 space-y-2">
        <NavLink
          to="/home/dashboard"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg font-medium text-m ${
              isActive
                ? "bg-blue-100 text-gray-600"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/home/inventory"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg font-medium text-m ${
              isActive
                ? "bg-blue-100 text-gray-600"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          Inventory
        </NavLink>
        <NavLink
          to="/home/staff list"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg font-medium text-m ${
              isActive
                ? "bg-blue-100 text-gray-600"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          Staff list
        </NavLink>
        <NavLink
          to="/home/register"
          className={({ isActive }) =>
            `px-4 py-2 rounded-lg font-medium text-m ${
              isActive
                ? "bg-blue-100 text-gray-600"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          ADD user
        </NavLink>
      </nav>
    </div>
  );
}
