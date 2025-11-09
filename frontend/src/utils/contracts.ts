import { ethers } from 'ethers';
import contractAddresses from './contractAddresses.json';

// ABI for MockUSDC
export const MOCK_USDC_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

// ABI for FundToken
export const FUND_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "function decimals() view returns (uint8)",
];

// ABI for Fund
export const FUND_ABI = [
  "function vcManager() view returns (address)",
  "function acceptedStablecoin() view returns (address)",
  "function lpToken() view returns (address)",
  "function totalDeposited() view returns (uint256)",
  "function totalInvested() view returns (uint256)",
  "function totalReturns() view returns (uint256)",
  "function carriedInterestPercent() view returns (uint256)",
  "function fundActive() view returns (bool)",
  "function lpContributions(address) view returns (uint256)",
  "function investments(address) view returns (uint256)",
  "function deposit(uint256 amount)",
  "function invest(address startup, uint256 amount, string description)",
  "function depositReturns(uint256 amount)",
  "function distributeReturns()",
  "function lpWithdraw(uint256 lpTokenAmount)",
  "function getFundStats() view returns (uint256, uint256, uint256, uint256, uint256, bool)",
  "function getLPShare(address lp) view returns (uint256)",
  "event Deposit(address indexed lp, uint256 amount, uint256 lpTokens)",
  "event InvestmentMade(address indexed startup, uint256 amount, string description)",
  "event ReturnsDeposited(uint256 amount)",
  "event ReturnsDistributed(uint256 lpReturns, uint256 vcCarry)",
  "event Withdrawal(address indexed lp, uint256 amount, uint256 lpTokensBurned)",
];

// ABI for FundFactory
export const FUND_FACTORY_ABI = [
  "function createFund(address stablecoinAddress, uint256 carriedInterestPercent) returns (address fundAddress, address lpTokenAddress)",
  "function getAllFunds() view returns (address[])",
  "function getVCFunds(address vc) view returns (address[])",
  "function getFundCount() view returns (uint256)",
  "function funds(uint256) view returns (address)",
  "event FundCreated(address indexed vcManager, address indexed fundAddress, address lpTokenAddress, uint256 carriedInterestPercent)",
];

export const getContractAddresses = () => contractAddresses;

export const getProvider = () => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    return new ethers.BrowserProvider((window as any).ethereum);
  }
  return null;
};

export const getSigner = async () => {
  const provider = getProvider();
  if (!provider) return null;
  return await provider.getSigner();
};

export const getMockUSDCContract = async () => {
  const signer = await getSigner();
  if (!signer || !contractAddresses.mockUSDC || contractAddresses.mockUSDC === '') return null;
  return new ethers.Contract(contractAddresses.mockUSDC, MOCK_USDC_ABI, signer);
};

export const getFundFactoryContract = async () => {
  const signer = await getSigner();
  if (!signer || !contractAddresses.fundFactory || contractAddresses.fundFactory === '') return null;
  return new ethers.Contract(contractAddresses.fundFactory, FUND_FACTORY_ABI, signer);
};

export const getFundContract = async (fundAddress: string) => {
  const signer = await getSigner();
  if (!signer) return null;
  return new ethers.Contract(fundAddress, FUND_ABI, signer);
};

export const getFundTokenContract = async (tokenAddress: string) => {
  const signer = await getSigner();
  if (!signer) return null;
  return new ethers.Contract(tokenAddress, FUND_TOKEN_ABI, signer);
};

export const formatTokenAmount = (amount: bigint, decimals: number = 6) => {
  return ethers.formatUnits(amount, decimals);
};

export const parseTokenAmount = (amount: string, decimals: number = 6) => {
  return ethers.parseUnits(amount, decimals);
};

