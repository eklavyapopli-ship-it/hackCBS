import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/Button';

export default function StartupApplyForm() {
  const [startup, setStartup] = useState({ name: '', idea: '', funding: '' });

  return (
    <form className="space-y-4 bg-white p-4 rounded-xl">
      <Input placeholder="Startup Name" onChange={(e: any) => setStartup({ ...startup, name: e.target.value })} />
      <Input placeholder="Idea Summary" onChange={(e: any) => setStartup({ ...startup, idea: e.target.value })} />
      <Input placeholder="Funding Required (ETH)" onChange={(e: any) => setStartup({ ...startup, funding: e.target.value })} />
      <Button>Submit Application</Button>
    </form>
  );
}
