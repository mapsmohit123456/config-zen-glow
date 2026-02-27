import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import Ticker from '@/components/dashboard/Ticker';
import { useDashboardStore } from '@/store/dashboardStore';
import DashboardPage from '@/pages/DashboardPage';
import PositionsPage from '@/pages/PositionsPage';
import ConfigurePage from '@/pages/ConfigurePage';
import PerformancePage from '@/pages/PerformancePage';
import LogsPage from '@/pages/LogsPage';
import RiskPage from '@/pages/RiskPage';
import AdvDecPage from '@/pages/AdvDecPage';

const pages: Record<string, React.FC> = {
  dashboard: DashboardPage,
  positions: PositionsPage,
  configure: ConfigurePage,
  performance: PerformancePage,
  advdec: AdvDecPage,
  logs: LogsPage,
  risk: RiskPage,
};

const Index = () => {
  const { page, sidebarCollapsed } = useDashboardStore();
  const PageComponent = pages[page] || DashboardPage;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={`transition-all ${sidebarCollapsed ? 'ml-16' : 'ml-[252px]'}`}>
        <Topbar />
        <div className="mt-[62px]">
          <Ticker />
          <main className="p-6">
            <PageComponent />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
