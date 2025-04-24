import CurrentStockLevel from "./CurrentStockLevel";
import SalesPredictionChart from "../components/SalesPredictionChart";

export default function Dashboard() {
  return (
    <div className=" min-h-screen bg-white">

      {/* Charts in same row */}
      <div className="flex flex-row gap-6">
        {/* Current Stock Levels Card */}
        <div className="bg-gray-100 shadow-md rounded-2xl p-6 w-full md:w-[500px]">
          <CurrentStockLevel />
        </div>

        {/* Sales Prediction Card */}
        <div className="bg-gray-100 shadow-md rounded-2xl p-6 w-full md:w-[680px]">
          <SalesPredictionChart />
        </div>
      </div>
    </div>
  );
}
