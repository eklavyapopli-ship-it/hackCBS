export default function ManageFundsPage() {
  const dummyFunds = [
    { name: 'Alpha Growth Fund', capital: '1200 ETH', startups: 6 },
    { name: 'Seed Catalyst', capital: '800 ETH', startups: 3 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Active Funds</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummyFunds.map((fund) => (
          <div key={fund.name} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-800">{fund.name}</h3>
            <p className="text-gray-500 mt-1">Total Capital: {fund.capital}</p>
            <p className="text-gray-500">Active Startups: {fund.startups}</p>
            <button className="mt-4 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}
