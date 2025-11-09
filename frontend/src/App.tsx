import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateFund from './pages/CreateFund';
import FundDetails from './pages/FundDetails';
import InvestPage from './pages/lp/Invest';
import PortfolioPage from './pages/lp/Portfolio';
import LPDashboard from './pages/lp/LPDashboard';
import VCHomePage from './pages/vc/VCHome';
import ManageFundsPage from './pages/vc/ManageFunds';
import ProposalsPage from './pages/vc/Proposals';
import ReportsPage from './pages/startup/ReportsPage';
import ApplyFunding from './pages/startup/ApplyFunding';
import FundingStatus from './pages/startup/FundingStatus';
import StartupDashboard from './pages/startup/StartupDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
    <Route path="/create-fund" element={<CreateFund />} />
        <Route path="/fund/:fundAddress" element={<FundDetails />} />
    <Route path="/lp/invest" element={<InvestPage />} />
    <Route path="/lp" element={<LPDashboard />} />
    <Route path="/lp/portfolio" element={<PortfolioPage />} />
    <Route path="/vc" element={<VCHomePage />} />
    <Route path="/vc/create-fund" element={<CreateFund />} />
    <Route path="/vc/manage-funds" element={<ManageFundsPage />} />
    <Route path="/vc/proposals" element={<ProposalsPage />} />
    <Route path="/vc/analytics" element={<ReportsPage />} />
    <Route path="/startup" element={<StartupDashboard />} />
    <Route path="/startup/apply" element={<ApplyFunding />} />
    <Route path="/startup/funding-status" element={<FundingStatus />} />
    <Route path="/startup/reports" element={<ReportsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

