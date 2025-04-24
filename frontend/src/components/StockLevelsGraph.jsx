import React, { useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getElementAtEvent } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const StockLevelsGraph = ({ stocked, lowStock, noStock, onSegmentClick }) => {
  const chartRef = useRef();

  const data = {
    labels: ["Stocked", "Low Stock", "No Stock"],
    datasets: [
      {
        label: "Inventory",
        data: [stocked, lowStock, noStock],
        backgroundColor: [
          "rgba(34, 197, 94, 0.6)",
          "rgba(251, 191, 36, 0.6)",
          "rgba(239, 68, 68, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleClick = (event) => {
    const element = getElementAtEvent(chartRef.current, event);
    if (!element.length) return;

    const index = element[0].index;
    if (index === 0) onSegmentClick("stocked");
    else if (index === 1) onSegmentClick("low");
    else if (index === 2) onSegmentClick("none");
  };

  return <Pie ref={chartRef} data={data} onClick={handleClick} />;
};

export default StockLevelsGraph;
