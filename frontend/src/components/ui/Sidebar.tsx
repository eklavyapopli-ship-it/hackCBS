import { Link } from 'react-router-dom';

export default function VCSidebar() {
  return (
    <aside className="w-56 bg-white border-r border-gray-100 min-h-screen p-4">
      <nav className="space-y-2">
        <Link to="/vc" className="block px-3 py-2 rounded hover:bg-gray-50">Home</Link>
        <Link to="/vc/create-fund" className="block px-3 py-2 rounded hover:bg-gray-50">Create Fund</Link>
        <Link to="/vc/manage-funds" className="block px-3 py-2 rounded hover:bg-gray-50">Manage Funds</Link>
        <Link to="/vc/proposals" className="block px-3 py-2 rounded hover:bg-gray-50">Proposals</Link>
        <Link to="/vc/analytics" className="block px-3 py-2 rounded hover:bg-gray-50">Analytics</Link>
      </nav>
    </aside>
  );
}
