import InvestmentCard from '../../components/dashboard/InvestmentCard';

export default function PortfolioPage() {
  const investments = [
    {
      id: 1,
      fund: 'Tech Growth Fund',
      amount: '5,000 USDC',
      share: '2.1%',
      status: 'Active',
    },
    {
      id: 2,
      fund: 'Green Future Fund',
      amount: '2,000 USDC',
      share: '0.9%',
      status: 'Active',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Portfolio</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {investments.map((item) => (
            <InvestmentCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
}
