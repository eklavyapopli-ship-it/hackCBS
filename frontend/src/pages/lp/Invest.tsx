import InvestForm from '../../components/forms/InvestForm';

export default function InvestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Invest in a Fund</h1>
        <p className="text-gray-600 mb-8">
          Choose a fund and contribute USDC or ETH to receive LP tokens.
        </p>

        <div className="bg-white rounded-lg shadow p-6">
          <InvestForm />
        </div>
      </div>
    </div>
  );
}
