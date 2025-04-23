import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./SideBar";
import Dashboard from "./Dashboard";
import Inventory from "./Inventory";
import Register from "./Register";

export default function Home() {
  return (
    <div className="h-screen w-screen flex bg-white">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <Routes>
          {/* Relative to /home */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="register" element={<Register />} />
          
        </Routes>
      </div>
    </div>
  );
}
