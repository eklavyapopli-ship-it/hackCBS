import { useWallet } from '../hooks/useWallet';

export default function ConnectWallet() {
  const { wallet, connectWallet } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (wallet.isConnected) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">
          <div className="font-semibold">{formatAddress(wallet.address!)}</div>
          <div className="text-xs">{(parseFloat(wallet.balance)).toFixed(4)} ETH</div>
        </div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
    >
      Connect Wallet
    </button>
  );
}

