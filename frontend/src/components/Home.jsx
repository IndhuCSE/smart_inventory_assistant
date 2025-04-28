import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "./SideBar";
import Dashboard from "./Dashboard";
import Inventory from "./Inventory";
import Register from "./Register";
import StaffList from "./StaffList";
import 'react-toastify/dist/ReactToastify.css';

// Function to fetch low stock items
const checkLowStock = async () => {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/low-stock');
    const data = await res.json();
    console.log(data);

    if (data.length > 0) {
      data.forEach((item) => {
        toast.error(
          <div>
            <strong>{item.item_name}</strong> is low on stock! Only {item.quantity} left.
          </div>,
          {
            autoClose: false,
            closeOnClick: true,
          }
        );
      });
    }
  } catch (error) {
    console.error("Error fetching low stock data", error);
  }
};

export default function Home() {
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    if (firstRender) {
      checkLowStock();
      setFirstRender(false);
    }
    const interval = setInterval(checkLowStock, 1800000);

    return () => clearInterval(interval);
  }, [firstRender]);

  return (
    <div className="h-screen w-screen flex bg-white">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="register" element={<Register />} />
          <Route path="stafflist" element={<StaffList />} />
        </Routes>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={false}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        pauseOnHover
      />
    </div>
  );
}
