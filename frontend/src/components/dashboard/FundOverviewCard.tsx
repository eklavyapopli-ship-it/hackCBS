import { Link } from 'react-router-dom';

type FundProps = {
  id: number | string;
  name: string;
  aum: string;
  roi: string;
};

export default function FundOverviewCard({ id, name, aum, roi }: FundProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500 mt-1">AUM: <span className="font-medium text-gray-800">{aum}</span></p>
        <p className="text-sm text-gray-500">ROI: <span className="font-medium text-gray-800">{roi}</span></p>
      </div>

      <div className="flex items-center gap-3">
        <Link to={`/funds/${id}`} className="text-sm text-indigo-600 hover:underline">
          View Details
        </Link>
        <button className="px-3 py-1 bg-green-600 text-white rounded-md text-sm">Invest</button>
      </div>
    </div>
  );
}
