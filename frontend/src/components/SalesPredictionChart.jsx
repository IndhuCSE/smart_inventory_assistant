import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const SalesPredictionChart = () => {
    const [file, setFile] = useState(null);
    const [chartData, setChartData] = useState(null);

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("http://localhost:8000/predict/sales/predict", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const predictions = res.data;

            const labels = predictions.map((entry) => entry.sale_date);
            const data = predictions.map((entry) => entry.predicted_quantity);

            setChartData({
                labels,
                datasets: [
                    {
                        label: "Predicted Sales",
                        data,
                        backgroundColor: "#3b82f6", // Tailwind blue-500
                    },
                ],
            });
        } catch (err) {
            console.error("Prediction upload error:", err);
        }
    };

    return (
        <div className="w-157 bg-white p-4 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold text-center mb-2 text-gray-900">Sales Prediction</h2>
            <p className="text-sm text-center text-gray-500 mb-4">Forecasted demand based on recent sales</p>

            {chartData ? (
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: { legend: { display: true, position: "top" } },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: { stepSize: 1 },
                            },
                        },
                    }}
                />
            ) : (
                <p className="text-center text-gray-400 italic">No prediction data yet</p>
            )}

            <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4">
                <input
                    type="file"
                    accept=".csv"
                    className="text-sm text-gray-700"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <button
                    onClick={handleUpload}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                >
                    Predict
                </button>
            </div>
        </div>
    );
};

export default SalesPredictionChart;
