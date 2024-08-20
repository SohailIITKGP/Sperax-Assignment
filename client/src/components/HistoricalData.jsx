import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HistoricalData = () => {
  const [token, setToken] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [historicalData, setHistoricalData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchHistoricalData = async (token, start, end) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/${token}/market_chart/range?vs_currency=usd&from=${start}&to=${end}`);
      const data = await response.json();
      if (data.prices) {
        setError('');
        setHistoricalData(data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString(),
          price: price.toFixed(2)
        })));
      } else {
        setError('Failed to fetch historical data.');
        setHistoricalData([]);
      }
    } catch (error) {
      setError('Failed to fetch historical data.');
      setHistoricalData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchData = () => {
    if (token && startDate && endDate) {
      const start = Math.floor(new Date(startDate).getTime() / 1000);
      const end = Math.floor(new Date(endDate).getTime() / 1000);
      fetchHistoricalData(token, start, end);
    } else {
      setError('Please enter a token and select date range.');
    }
  };

  const chartData = {
    labels: historicalData.map(item => item.date),
    datasets: [
      {
        label: 'Price (USD)',
        data: historicalData.map(item => item.price),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${token.toUpperCase()} Price History`,
      },
    },
  };

  return (
    <div className="gradient-bg-transactions p-6 shadow-lg w-full mx-auto">
      <h2 className="text-white text-3xl mb-6 text-center font-bold">Historical Data</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter token ID (e.g., ethereum)"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none"
        />
        <div className="flex space-x-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-1/2 p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-1/2 p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:border-purple-500 focus:outline-none"
          />
        </div>
        <div className="text-center">
          <button
            onClick={handleFetchData}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Fetching...' : 'Fetch Data'}
          </button>
        </div>
      </div>
      {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
      {historicalData.length > 0 && (
        <div className="mt-8">
          <div className="bg-white p-4 rounded-lg w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
          <h3 className="text-white text-xl my-4">Price History</h3>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="grid grid-cols-2 bg-gray-700 p-3 font-bold text-white">
              <div>Date</div>
              <div className="text-right">Price (USD)</div>
            </div>
            {historicalData.map((item, index) => (
              <div key={index} className="grid grid-cols-2 p-3 border-b border-gray-700 text-white hover:bg-gray-750 transition duration-150">
                <div>{item.date}</div>
                <div className="text-right">${item.price}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricalData;
