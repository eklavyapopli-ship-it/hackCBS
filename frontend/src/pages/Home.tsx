import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const ArrowRightIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShieldCheckIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l7 4v5c0 5-3.58 9.74-7 11-3.42-1.26-7-6-7-11V6l7-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.5 12.5l1.8 1.8L15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WorkflowIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 7h10M7 12h10M7 17h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="5" cy="7" r="1" fill="currentColor" />
    <circle cx="5" cy="12" r="1" fill="currentColor" />
    <circle cx="5" cy="17" r="1" fill="currentColor" />
  </svg>
);

const BarChartIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="11" width="4" height="8" rx="1" fill="currentColor" />
    <rect x="10" y="7" width="4" height="12" rx="1" fill="currentColor" />
    <rect x="17" y="3" width="4" height="16" rx="1" fill="currentColor" />
  </svg>
);

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center px-6 md:px-12 lg:px-24 py-20 bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="text-center max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-gray-900 leading-tight">
          TrustChain — The Future of <span className="text-green-500">Venture Capital</span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl mb-10">
          A decentralized platform that empowers investors (LPs), fund managers (VCs), and startups 
          to collaborate and grow — with full transparency, powered by blockchain.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/lp">
            <Button className="px-6 py-3 text-lg">
              Enter LP Dashboard <ArrowRightIcon className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link to="/vc">
            <Button variant="outline" className="px-6 py-3 text-lg">
              Enter VC Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="mt-24 w-full max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-gray-900">
          Our Workflow — <span className="text-green-500">Transparent & Secure</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <ShieldCheckIcon className="w-12 h-12 text-green-500" />,
              title: '1. Secure Onboarding',
              desc: 'LPs, VCs, and Startups register via verified blockchain wallets and identity checks.',
            },
            {
              icon: <WorkflowIcon className="w-12 h-12 text-green-500" />,
              title: '2. Smart Contract Funding',
              desc: 'Capital pools are created through audited smart contracts ensuring trustless investment flow.',
            },
            {
              icon: <BarChartIcon className="w-12 h-12 text-green-500" />,
              title: '3. Transparent Growth',
              desc: 'All fund allocations and returns are tracked on-chain for full visibility to all stakeholders.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 hover:shadow-md transition"
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2 text-center">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm text-center">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="mt-24 w-full max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-gray-900">
          Why Choose <span className="text-green-500">TrustChain</span>?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Auditable Transactions',
              desc: 'Every investment and payout is recorded immutably on-chain, ensuring zero manipulation.',
            },
            {
              title: 'Smart Fund Management',
              desc: 'Automate fund distribution, milestone-based payouts, and investor transparency in real-time.',
            },
            {
              title: 'DAO Governance',
              desc: 'Empowering community-driven decisions and reducing centralized control in venture funding.',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="border border-gray-200 p-8 rounded-2xl bg-white hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg mb-3 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-28 text-center bg-blue-50 p-12 rounded-3xl max-w-5xl shadow-sm">
        <h2 className="text-3xl font-semibold mb-4 text-gray-900">
          Ready to Transform Venture Capital?
        </h2>
        <p className="text-gray-700 mb-8 text-lg">
          Join the decentralized future of investment. Become an LP, VC, or Startup today.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/auth/register">
            <Button className="px-6 py-3 text-lg bg-blue-600 hover:bg-blue-700">Get Started</Button>
          </Link>
          <Link to="/auth/login">
            <Button variant="outline" className="px-6 py-3 text-lg">Already a member? Login</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 text-center text-gray-500 text-sm border-t pt-6 w-full">
        © {new Date().getFullYear()} TrustChain — Built for Transparency & Trust.
      </footer>
    </main>
  );
}

