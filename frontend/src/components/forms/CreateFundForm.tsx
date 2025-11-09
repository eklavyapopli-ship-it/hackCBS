import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/Button';

export default function CreateFundForm() {
  const [fund, setFund] = useState({ name: '', goal: '', sector: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(fund);
    alert('Fund created (mock)');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-xl shadow-sm">
      <Input placeholder="Fund Name" onChange={(e: any) => setFund({ ...fund, name: e.target.value })} />
      <Input placeholder="Goal Amount (ETH)" onChange={(e: any) => setFund({ ...fund, goal: e.target.value })} />
      <Input placeholder="Sector" onChange={(e: any) => setFund({ ...fund, sector: e.target.value })} />
      <Button type="submit">Create Fund</Button>
    </form>
  );
}
