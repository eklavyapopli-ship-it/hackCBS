import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import {
  getFundContract,
  getFundTokenContract,
  getMockUSDCContract,
  formatTokenAmount,
  parseTokenAmount,
} from '../utils/contracts';
import ConnectWallet from '../components/ConnectWallet';
import { useWallet } from '../hooks/useWallet';

const FundDetails: React.FC = () => {
  const { fundAddress } = useParams<{ fundAddress: string }>();
  const navigate = useNavigate();
  const { wallet } = useWallet();

  const [stats, setStats] = useState<any>(null);
  const [isVCManager, setIsVCManager] = useState(false);
  const [lpTokenBalance, setLpTokenBalance] = useState('0');
  const [lpShare, setLpShare] = useState('0');
  const [usdcBalance, setUsdcBalance] = useState('0');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [depositAmount, setDepositAmount] = useState('');
  const [investStartup, setInvestStartup] = useState('');
  const [investAmount, setInvestAmount] = useState('');
  const [investDescription, setInvestDescription] = useState('');
  const [returnsAmount, setReturnsAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    if (fundAddress && wallet.isConnected) {
      loadFundData();
    }
  }, [fundAddress, wallet.isConnected, wallet.address]);

  const loadFundData = async () => {
    if (!fundAddress || !wallet.address) return;

    try {
      const fundContract = await getFundContract(fundAddress);
      if (!fundContract) return;

      const [fundStats, vcManager, lpTokenAddress] = await Promise.all([
        fundContract.getFundStats(),
        fundContract.vcManager(),
        fundContract.lpToken(),
      ]);

      setIsVCManager(vcManager.toLowerCase() === wallet.address.toLowerCase());

      setStats({
        totalDeposited: formatTokenAmount(fundStats[0], 6),
        totalInvested: formatTokenAmount(fundStats[1], 6),
        totalReturns: formatTokenAmount(fundStats[2], 6),
        contractBalance: formatTokenAmount(fundStats[3], 6),
        lpTokenSupply: formatTokenAmount(fundStats[4], 18),
        fundActive: fundStats[5],
      });

      // Load LP token balance
      const lpTokenContract = await getFundTokenContract(lpTokenAddress);
      if (lpTokenContract) {
        const balance = await lpTokenContract.balanceOf(wallet.address);
        setLpTokenBalance(formatTokenAmount(balance, 18));

        const share = await fundContract.getLPShare(wallet.address);
        setLpShare(formatTokenAmount(share, 6));
      }

      // Load USDC balance
      const usdcContract = await getMockUSDCContract();
      if (usdcContract) {
        const balance = await usdcContract.balanceOf(wallet.address);
        setUsdcBalance(formatTokenAmount(balance, 6));
      }
    } catch (error) {
      console.error('Error loading fund data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundAddress || !wallet.isConnected) return;

    setActionLoading(true);
    setError(null);

    try {
      const amount = parseTokenAmount(depositAmount, 6);
      const usdcContract = await getMockUSDCContract();
      const fundContract = await getFundContract(fundAddress);

      if (!usdcContract || !fundContract) throw new Error('Failed to get contracts');

      // Approve
      const approveTx = await usdcContract.approve(fundAddress, amount);
      await approveTx.wait();

      // Deposit
      const depositTx = await fundContract.deposit(amount);
      await depositTx.wait();

      setDepositAmount('');
      await loadFundData();
    } catch (err: any) {
      console.error('Error depositing:', err);
      setError(err.message || 'Failed to deposit');
    } finally {
      setActionLoading(false);
    }
  };

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundAddress || !wallet.isConnected) return;

    setActionLoading(true);
    setError(null);

    try {
      const amount = parseTokenAmount(investAmount, 6);
      const fundContract = await getFundContract(fundAddress);

      if (!fundContract) throw new Error('Failed to get contract');
      if (!ethers.isAddress(investStartup)) throw new Error('Invalid startup address');

      const investTx = await fundContract.invest(investStartup, amount, investDescription);
      await investTx.wait();

      setInvestStartup('');
      setInvestAmount('');
      setInvestDescription('');
      await loadFundData();
    } catch (err: any) {
      console.error('Error investing:', err);
      setError(err.message || 'Failed to invest');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDepositReturns = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundAddress || !wallet.isConnected) return;

    setActionLoading(true);
    setError(null);

    try {
      const amount = parseTokenAmount(returnsAmount, 6);
      const usdcContract = await getMockUSDCContract();
      const fundContract = await getFundContract(fundAddress);

      if (!usdcContract || !fundContract) throw new Error('Failed to get contracts');

      // Approve
      const approveTx = await usdcContract.approve(fundAddress, amount);
      await approveTx.wait();

      // Deposit returns
      const depositTx = await fundContract.depositReturns(amount);
      await depositTx.wait();

      setReturnsAmount('');
      await loadFundData();
    } catch (err: any) {
      console.error('Error depositing returns:', err);
      setError(err.message || 'Failed to deposit returns');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDistributeReturns = async () => {
    if (!fundAddress || !wallet.isConnected) return;

    setActionLoading(true);
    setError(null);

    try {
      const fundContract = await getFundContract(fundAddress);
      if (!fundContract) throw new Error('Failed to get contract');

      const tx = await fundContract.distributeReturns();
      await tx.wait();

      await loadFundData();
    } catch (err: any) {
      console.error('Error distributing returns:', err);
      setError(err.message || 'Failed to distribute returns');
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundAddress || !wallet.isConnected) return;

    setActionLoading(true);
    setError(null);

    try {
      const amount = parseTokenAmount(withdrawAmount, 18);
      const fundContract = await getFundContract(fundAddress);

      if (!fundContract) throw new Error('Failed to get contract');

      const withdrawTx = await fundContract.lpWithdraw(amount);
      await withdrawTx.wait();

      setWithdrawAmount('');
      await loadFundData();
    } catch (err: any) {
      console.error('Error withdrawing:', err);
      setError(err.message || 'Failed to withdraw');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading fund data...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Fund not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-gray-800 hover:text-primary-600"
            >
              VC Fund Platform
            </button>
            <ConnectWallet />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Fund {fundAddress?.slice(0, 6)}...{fundAddress?.slice(-4)}
          </h2>
          <p className={`mt-2 ${stats.fundActive ? 'text-green-600' : 'text-red-600'}`}>
            {stats.fundActive ? 'Active' : 'Inactive'}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Fund Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Deposited</p>
                  <p className="text-2xl font-bold">{parseFloat(stats.totalDeposited).toLocaleString()} mUSDC</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Invested</p>
                  <p className="text-2xl font-bold">{parseFloat(stats.totalInvested).toLocaleString()} mUSDC</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Returns</p>
                  <p className="text-2xl font-bold text-green-600">
                    {parseFloat(stats.totalReturns).toLocaleString()} mUSDC
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contract Balance</p>
                  <p className="text-2xl font-bold">{parseFloat(stats.contractBalance).toLocaleString()} mUSDC</p>
                </div>
              </div>
            </div>

            {/* LP Info */}
            {wallet.isConnected && !isVCManager && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">Your LP Position</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">LP Token Balance:</span>
                    <span className="font-semibold">{parseFloat(lpTokenBalance).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Your Share:</span>
                    <span className="font-semibold">{parseFloat(lpShare).toLocaleString()} mUSDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">USDC Balance:</span>
                    <span className="font-semibold">{parseFloat(usdcBalance).toLocaleString()} mUSDC</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-6">
            {/* Deposit (LP) */}
            {wallet.isConnected && !isVCManager && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">Deposit</h3>
                <form onSubmit={handleDeposit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount (mUSDC)</label>
                    <input
                      type="text"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="1000"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : 'Deposit'}
                  </button>
                </form>
              </div>
            )}

            {/* Withdraw (LP) */}
            {wallet.isConnected && !isVCManager && parseFloat(lpTokenBalance) > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">Withdraw</h3>
                <form onSubmit={handleWithdraw} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LP Tokens</label>
                    <input
                      type="text"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="1000"
                      required
                    />
                    <p className="mt-2 text-sm text-gray-500">Max: {parseFloat(lpTokenBalance).toLocaleString()}</p>
                  </div>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : 'Withdraw'}
                  </button>
                </form>
              </div>
            )}

            {/* Invest (VC) */}
            {wallet.isConnected && isVCManager && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">Invest in Startup</h3>
                <form onSubmit={handleInvest} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Startup Address</label>
                    <input
                      type="text"
                      value={investStartup}
                      onChange={(e) => setInvestStartup(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="0x..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount (mUSDC)</label>
                    <input
                      type="text"
                      value={investAmount}
                      onChange={(e) => setInvestAmount(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="10000"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={investDescription}
                      onChange={(e) => setInvestDescription(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Investment description..."
                      rows={3}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : 'Invest'}
                  </button>
                </form>
              </div>
            )}

            {/* Deposit Returns (VC) */}
            {wallet.isConnected && isVCManager && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">Deposit Returns</h3>
                <form onSubmit={handleDepositReturns} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount (mUSDC)</label>
                    <input
                      type="text"
                      value={returnsAmount}
                      onChange={(e) => setReturnsAmount(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="5000"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : 'Deposit Returns'}
                  </button>
                </form>
              </div>
            )}

            {/* Distribute Returns (VC) */}
            {wallet.isConnected && isVCManager && parseFloat(stats.totalReturns) > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">Distribute Returns</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Pending Returns: {parseFloat(stats.totalReturns).toLocaleString()} mUSDC
                </p>
                <button
                  onClick={handleDistributeReturns}
                  disabled={actionLoading}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Processing...' : 'Distribute Returns'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FundDetails;

