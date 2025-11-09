"use client";

interface InvestmentProps {
  fund: string;
  amount: string;
  share: string;
  status: string;
}

export default function InvestmentCard({
  fund,
  amount,
  share,
  status,
}: InvestmentProps) {
  return (
    <div className="border border-gray-200 p-5 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{fund}</h3>
      <div className="text-sm text-gray-500">Investment Amount:</div>
      <div className="text-base font-semibold mb-1">{amount}</div>
      <div className="text-sm text-gray-500">Share in Fund:</div>
      <div className="text-base font-semibold mb-2">{share}</div>
      <div
        className={`inline-block px-2 py-1 rounded-lg text-xs ${
          status === "Active"
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </div>
    </div>
  );
}
