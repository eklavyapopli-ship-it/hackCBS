import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';

export default function ApplyFunding() {
  const [form, setForm] = useState({
    name: '',
    project: '',
    amount: '',
    description: '',
  });

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('Application submitted:', form);
    alert('Your funding request has been submitted!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-semibold mb-6">Apply for Funding</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 max-w-xl space-y-4">
        <Input name="name" placeholder="Startup Name" value={form.name} onChange={handleChange} required />
        <Input name="project" placeholder="Project Title" value={form.project} onChange={handleChange} required />
        <Input name="amount" type="number" placeholder="Funding Amount (in USDT)" value={form.amount} onChange={handleChange} required />
        <Textarea name="description" placeholder="Project Description" value={form.description} onChange={handleChange} required />
        <Button type="submit" className="w-full">Submit Application</Button>
      </form>
    </div>
  );
}
