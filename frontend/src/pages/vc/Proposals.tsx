export default function ProposalsPage() {
  const proposals = [
    { name: 'AgroAI', sector: 'AgriTech', ask: '150 ETH', equity: '8%' },
    { name: 'Mediscan', sector: 'HealthTech', ask: '200 ETH', equity: '10%' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Investment Proposals</h1>
      <div className="space-y-4">
        {proposals.map((p) => (
          <div key={p.name} className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-gray-800">{p.name}</h3>
            <p className="text-gray-500">{p.sector}</p>
            <p className="text-gray-500 mt-2">Ask: {p.ask}</p>
            <p className="text-gray-500">Equity: {p.equity}</p>
            <div className="mt-3 flex gap-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">Approve</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
