import { Link } from 'react-router-dom';
import Card, { CardHeader, CardContent, CardTitle } from '../../components/ui/card';

const IconCoins = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function StartupDashboard() {
  const cards = [
    {
      title: 'Apply for Funding',
      desc: 'Submit your project proposal and funding request to VCs.',
      icon: <IconCoins className="w-10 h-10 text-green-500" />,
      href: '/startup/apply',
      gradient: 'from-blue-100 to-blue-50',
    },
    {
      title: 'Funding Status',
      desc: 'Track your funding application and approval progress.',
      icon: <IconCoins className="w-10 h-10 text-emerald-600" />,
      href: '/startup/funding-status',
      gradient: 'from-emerald-100 to-emerald-50',
    },
    {
      title: 'Reports & Analytics',
      desc: 'View investment insights and performance reports.',
      icon: <IconCoins className="w-10 h-10 text-purple-600" />,
      href: '/startup/reports',
      gradient: 'from-purple-100 to-purple-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">🚀 Startup Dashboard</h1>

        <p className="text-gray-600 mb-10 text-lg">Manage your funding applications, track progress, and explore analytics — all in one place.</p>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <div key={i}>
              <Link to={card.href}>
                <Card className={`bg-gradient-to-br ${card.gradient} border border-gray-200 shadow-md rounded-2xl transition-all duration-300`}>
                  <CardHeader className="flex flex-col items-start space-y-3 p-6">
                    <div className="p-3 bg-white rounded-full shadow-sm">{card.icon}</div>
                    <CardTitle className="text-xl font-semibold text-gray-800">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm p-6">{card.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
