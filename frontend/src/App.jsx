import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home';

// Function to fetch low stock items
const checkLowStock = async () => {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/low-stock');  // Endpoint to fetch low stock data
    const data = await res.json();
    console.log(data);  // Log the data for debugging

    if (data.length > 0) {
      data.forEach((item) => {
        toast.error(
          <div>
            <strong>{item.item_name}</strong> is low on stock! Only {item.quantity} left.
          </div>,
          {
            autoClose: false, // stays until user manually closes
            closeOnClick: true, // optional: allow click to close
          }
        );
      });
    }
  } catch (error) {
    console.error("Error fetching low stock data", error);
  }
};

function App() {
  useEffect(() => {
    checkLowStock();  // Run on initial load
    const interval = setInterval(checkLowStock, 1800000);  // Poll every 1 hour (3600000ms)

    return () => clearInterval(interval);  // Cleanup on component unmount
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/home/*" element={<Home />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={false} hideProgressBar={false} newestOnTop={true} closeOnClick={true} pauseOnHover/> {/* Toast container to display notifications */}
    </Router>
  );
}

export default App;
