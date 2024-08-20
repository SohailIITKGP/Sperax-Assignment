import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WatchList = () => {
  const [tokens, setTokens] = useState([]);
  const [balances, setBalances] = useState({});

  const addToken = async (tokenAddress) => {
    if (!tokens.includes(tokenAddress)) {
      setTokens([...tokens, tokenAddress]);
      try {
        const balance = await fetchTokenBalance(tokenAddress);
        setBalances((prevBalances) => ({
          ...prevBalances,
          [tokenAddress]: balance,
        }));
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    }
  };

  const fetchTokenBalance = async (tokenAddress) => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(tokenAddress);
        return ethers.utils.formatEther(balance);
      } catch (error) {
        console.error("Error fetching balance:", error);
        return 0;
      }
    } else {
      console.error("No Ethereum provider found. Install MetaMask.");
      return 0;
    }
  };

  const chartData = {
    labels: tokens,
    datasets: [
        {
            label: 'Token Balances (ETH)',
            data: tokens.map((token) => balances[token] || 0),
            backgroundColor:'#219ebc', 
            borderColor: '#219ebc',       
            borderWidth: 1,
            barThickness: 100, 
            categoryPercentage: 0.6, 
            barPercentage: 0.9, 
        },
    ],
};

const chartOptions = {
    scales: {
        x: {
            beginAtZero: true,
            grid: {
                display: false,
            },
        },
        y: {
            beginAtZero: true,
            grid: {
                display: false,
            },
        },
    },
};


  return (
    <div className="gradient-bg-transactions shadow-lg p-6 w-full mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-200">Watch List</h2>
      <div className="gradient-bg-transactions flex items-center mb-3">
        <input
          type="text"
          placeholder="Enter token address"
          id="tokenInput"
          className="mx-4 border border-gray-700 bg-gray-900 text-white rounded-l-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={() => addToken(document.getElementById('tokenInput').value)}
          className="bg-[#2a6f97] text-white rounded-lg px-4 py-2 hover:bg-[#ffb703] focus:outline-none flex items-start"
        >
          Add Token
        </button>
      </div>
      <ul className="space-y-2">
        {tokens.map((token) => (
          <li key={token} className="p-2 blue-glassmorphism rounded-md shadow-sm flex justify-between items-center mx-4">
            <span className="text-gray-300">{token}</span>
            <span className="font-medium text-[#2a6f97]">{balances[token] || 'Loading...'}</span>
          </li>
        ))}
      </ul>
      {tokens.length > 0 && (
        <div className="mt-6" style={{ height: '400px' }}>
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      )}
    </div>
  );
};

export default WatchList;
