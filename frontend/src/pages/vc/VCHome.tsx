import { Link } from 'react-router-dom';

export default function VCHomePage() {
  const sections = [
    { title: 'Create Fund', href: '/vc/create-fund', desc: 'Launch a new venture fund and onboard Limited Partners (LPs).' },
    { title: 'Manage Funds', href: '/vc/manage-funds', desc: 'Oversee active funds, LP commitments, and performance metrics.' },
    { title: 'Proposals', href: '/vc/proposals', desc: 'Review, approve, or reject startup investment proposals seamlessly.' },
    { title: 'Analytics', href: '/vc/analytics', desc: 'Track portfolio ROI, fund performance, and capital efficiency.' },
  ];

  const stats = [
    { label: 'Active Funds', value: '3', color: 'text-green-500' },
    { label: 'LPs Onboarded', value: '42', color: 'text-emerald-600' },
    { label: 'Total AUM', value: '$8.5M', color: 'text-indigo-600' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-6 md:px-12 py-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Venture Capital Dashboard</h1>
          <p className="text-gray-600">Welcome back! Manage your venture funds, LPs, and investments effortlessly.</p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={`text-3xl font-semibold ${stat.color} mt-2`}>{stat.value}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Fund Management Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section, index) => (
            <Link key={index} to={section.href} className="block">
              <div className="bg-white border border-gray-200 hover:shadow-md rounded-2xl p-6 transition-all cursor-pointer group">
                <div className="flex items-center justify-center mb-4 bg-blue-50 rounded-xl w-14 h-14 group-hover:scale-105 transition"></div>
                <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                <p className="text-gray-500 mt-2 text-sm">{section.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
