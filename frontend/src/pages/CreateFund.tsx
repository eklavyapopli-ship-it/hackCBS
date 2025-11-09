import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFundFactoryContract, getContractAddresses } from '../utils/contracts';
import ConnectWallet from '../components/ConnectWallet';
import { useWallet } from '../hooks/useWallet';

const CreateFund: React.FC = () => {
  const [carriedInterest, setCarriedInterest] = useState('20');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { wallet } = useWallet();

  const handleCreateFund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const addresses = getContractAddresses();
      const factoryContract = await getFundFactoryContract();
      if (!factoryContract) {
        throw new Error('Failed to get factory contract');
      }

      const carryPercent = parseInt(carriedInterest);
      if (isNaN(carryPercent) || carryPercent < 0 || carryPercent > 100) {
        throw new Error('Carried interest must be between 0 and 100');
      }

      const tx = await factoryContract.createFund(addresses.mockUSDC, carryPercent);
      await tx.wait();

      navigate('/');
    } catch (err: any) {
      console.error('Error creating fund:', err);
      setError(err.message || 'Failed to create fund');
    } finally {
      setLoading(false);
    }
  };

  if (!wallet.isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Please connect your wallet to create a fund</p>
          <ConnectWallet />
        </div>
      </div>
    );
  }

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

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Fund</h2>

          <form onSubmit={handleCreateFund} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carried Interest Percentage
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={carriedInterest}
                onChange={(e) => setCarriedInterest(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="20"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                The percentage of profits that goes to the VC manager (0-100)
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Fund'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateFund;

