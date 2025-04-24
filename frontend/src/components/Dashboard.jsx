import React, { useState, useEffect } from "react";
// import StockLevels from "./StockLevelsGraph";
import CurrentStockLevel from "./CurrentStockLevel";

export default function Dashboard() {
    
    return (
        <div>
            <CurrentStockLevel/>
        </div>
    );
}
