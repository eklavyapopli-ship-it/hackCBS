import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/Button';

export default function ProposalForm() {
  const [proposal, setProposal] = useState({ title: '', description: '' });

  return (
    <form className="space-y-4 bg-white p-4 rounded-xl">
      <Input placeholder="Proposal Title" onChange={(e: any) => setProposal({ ...proposal, title: e.target.value })} />
      <Input placeholder="Description" onChange={(e: any) => setProposal({ ...proposal, description: e.target.value })} />
      <Button>Submit Proposal</Button>
    </form>
  );
}
