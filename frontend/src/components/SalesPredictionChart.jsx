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

            const labels = Object.keys(predictions);
            const data = Object.values(predictions);

            setChartData({
                labels,
                datasets: [
                    {
                        label: "Predicted Sales (Next 30 Days)",
                        data,
                        backgroundColor: "#3b82f6",
                    },
                ],
            });
        } catch (err) {
            console.error("Prediction upload error:", err);
            setChartData(null);
        }
    };

    return (
        <div className="w-full bg-white p-6 rounded-2xl shadow-lg">
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
                {/* Hidden file input */}
                <input
                    type="file"
                    accept=".csv"
                    id="fileInput"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0])}
                />

                {/* Styled label as green button */}
                <label
                    htmlFor="fileInput"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium cursor-pointer"
                >
                    Choose File
                </label>

                {/* Predict button */}
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
