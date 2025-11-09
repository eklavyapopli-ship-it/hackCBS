import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import FundOverviewCard from '../../components/dashboard/FundOverviewCard';

const WalletIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 7h18v10H2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 11a1 1 0 100-2 1 1 0 000 2z" fill="currentColor"/>
  </svg>
);

const TrendingIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17l6-6 4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BarChartIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="11" width="4" height="8" rx="1" fill="currentColor"/>
    <rect x="10" y="7" width="4" height="12" rx="1" fill="currentColor"/>
    <rect x="17" y="3" width="4" height="16" rx="1" fill="currentColor"/>
  </svg>
);

export default function LPDashboard() {
  const mockFunds = [
    { id: 1, name: 'Tech Growth Fund', aum: '2.5M USDC', roi: '18%' },
    { id: 2, name: 'Green Future Fund', aum: '1.2M USDC', roi: '12%' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-6 md:px-12 py-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Limited Partner Dashboard</h1>
          <p className="text-gray-600 text-sm md:text-base">
            Track your investments, analyze returns, and invest in verified on-chain funds.
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Link to="/lp/invest">
            <Button className="px-5 py-2">Invest in Fund</Button>
          </Link>
          <Link to="/lp/performance">
            <Button variant="outline" className="px-5 py-2">View Analytics</Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: <WalletIcon className="w-8 h-8 text-green-500" />,
            title: 'Total Invested',
            value: '$3.7M USDC',
          },
          {
            icon: <TrendingIcon className="w-8 h-8 text-green-600" />,
            title: 'Average ROI',
            value: '15.2%',
          },
          {
            icon: <BarChartIcon className="w-8 h-8 text-indigo-600" />,
            title: 'Active Funds',
            value: '2',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="bg-blue-50 p-3 rounded-xl">{stat.icon}</div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </section>

      {/* Fund Cards */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Investments</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {mockFunds.map((fund) => (
            <div
              key={fund.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <FundOverviewCard {...fund} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-20 text-center bg-blue-50 py-12 px-6 rounded-3xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Expand Your Investment Portfolio
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover new on-chain venture funds, monitor ROI in real-time, and invest confidently with full transparency.
        </p>
        <Link to="/lp/invest">
          <Button className="px-6 py-3 text-lg">Explore Funds</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-16 text-center text-gray-500 text-sm border-t pt-6">
        © {new Date().getFullYear()} TrustChain — Empowering Smart Investments.
      </footer>
    </main>
  );
}
