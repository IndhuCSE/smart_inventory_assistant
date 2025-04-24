import React, { useState, useEffect } from "react";
import StockLevelsGraph from "./StockLevelsGraph";

export default function CurrentStockLevel() {
    const [items, setItems] = useState([]);
    const [stocked, setStocked] = useState(0);
    const [lowStock, setLowStock] = useState(0);
    const [noStock, setNoStock] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        async function fetchStockLevels() {
            try {
                const response = await fetch("http://127.0.0.1:8000/inventory/");
                if (!response.ok) {
                    throw new Error("Failed to fetch inventory data");
                }
                const data = await response.json();

                let stockedCount = 0;
                let lowStockCount = 0;
                let noStockCount = 0;

                data.forEach((item) => {
                    const quantity = item.quantity;
                    if (quantity > 20) {
                        stockedCount++;
                    } else if (quantity > 0) {
                        lowStockCount++;
                    } else {
                        noStockCount++;
                    }
                });

                console.log(data)
                setItems(data);
                setStocked(stockedCount);
                setLowStock(lowStockCount);
                setNoStock(noStockCount);
            } catch (error) {
                console.error("Error fetching stock levels:", error);
            }
        }

        fetchStockLevels();
    }, []);

    const filteredItems = items.filter((item) => {
        if (selectedCategory === "stocked") return item.quantity > 20;
        if (selectedCategory === "low") return item.quantity > 0 && item.quantity <= 20;
        if (selectedCategory === "none") return item.quantity === 0;
        return false;
    });

    return (
        <div>
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="w-96 bg-white p-4 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Current Stock Levels</h2>
                    <p className="mt-4 text-gray-700 font-medium">Total Items: {items.length}</p>
                    <StockLevelsGraph
                        stocked={stocked}
                        lowStock={lowStock}
                        noStock={noStock}
                        onSegmentClick={setSelectedCategory}
                    />

                    {selectedCategory && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold capitalize mb-2 text-gray-800">
                                {selectedCategory === "stocked"
                                    ? "Stocked Items"
                                    : selectedCategory === "low"
                                        ? "Low Stock Items"
                                        : "No Stock Items"}
                            </h3>
                            {filteredItems.length === 0 ? (
                                <p className="text-gray-500">No items in this category.</p>
                            ) : (
                                <ul className="list-disc list-inside text-gray-600">
                                    {filteredItems.map((item, idx) => (
                                        <li key={idx}>
                                            {item.name} — {item.quantity}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}