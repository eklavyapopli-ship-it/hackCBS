import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFundFactoryContract } from '../utils/contracts';
import FundCard from '../components/FundCard';
import ConnectWallet from '../components/ConnectWallet';
import { useWallet } from '../hooks/useWallet';

const Home: React.FC = () => {
  const [funds, setFunds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { wallet } = useWallet();

  useEffect(() => {
    const loadFunds = async () => {
      // Only load if wallet is connected
      if (!wallet.isConnected) {
        setLoading(false);
        return;
      }

      try {
        const factoryContract = await getFundFactoryContract();
        if (!factoryContract) {
          console.warn('FundFactory contract not available. Make sure contracts are deployed.');
          setLoading(false);
          return;
        }

        const allFunds = await factoryContract.getAllFunds();
        setFunds(allFunds);
      } catch (error) {
        console.error('Error loading funds:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFunds();
    const interval = setInterval(loadFunds, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [wallet.isConnected]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-800">VC Fund Platform</h1>
            <ConnectWallet />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">All Funds</h2>
          {wallet.isConnected && (
            <button
              onClick={() => navigate('/create-fund')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
            >
              Create Fund
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : funds.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No funds created yet.</p>
            {wallet.isConnected && (
              <button
                onClick={() => navigate('/create-fund')}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create First Fund
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {funds.map((fundAddress) => (
              <FundCard key={fundAddress} fundAddress={fundAddress} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;

