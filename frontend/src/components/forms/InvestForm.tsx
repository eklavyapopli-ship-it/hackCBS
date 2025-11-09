import React, { useState } from 'react';
import { Button } from '../ui/Button';

const mockFunds = [
  { id: '0x1', name: 'Tech Growth Fund' },
  { id: '0x2', name: 'Green Future Fund' },
];

export const InvestForm: React.FC = () => {
  const [fund, setFund] = useState<string>(mockFunds[0].id);
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<'USDC' | 'ETH'>('USDC');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Placeholder: wire up contract interactions here
    console.log('Investing', { fund, amount, currency });
    setTimeout(() => setSubmitting(false), 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Fund</label>
        <select
          value={fund}
          onChange={(e) => setFund(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          {mockFunds.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="1000"
            required
          />
          <select value={currency} onChange={(e) => setCurrency(e.target.value as any)} className="px-3 py-2 border border-gray-300 rounded-lg">
            <option value="USDC">USDC</option>
            <option value="ETH">ETH</option>
          </select>
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" className="px-4 py-2" disabled={submitting}>
          {submitting ? 'Processing...' : 'Contribute'}
        </Button>
      </div>
    </form>
  );
};

export default InvestForm;
