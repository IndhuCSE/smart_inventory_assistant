import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./SideBar";


export default function Dashboard() {

    return (
        <div className="h-screen w-screen flex bg-white">
            <Sidebar />
            <h1>dashboard</h1>
        </div>
    );
}