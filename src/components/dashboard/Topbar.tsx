import { useState, useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';

const pageTitles: Record<string, { title: string; sub: string }> = {
  dashboard: { title: 'Dashboard', sub: 'Pyramid Entry · NSE F&O' },
  positions: { title: 'Positions', sub: 'Active & Historical Trades' },
  configure: { title: 'Configure', sub: 'Strategy Parameters' },
  performance: { title: 'Performance', sub: 'Trade Analytics' },
  logs: { title: 'Trade Logs', sub: 'Execution History' },
  risk: { title: 'Risk Monitor', sub: 'Capital & Exposure' },
};

const Topbar = () => {
  const { page, sidebarCollapsed } = useDashboardStore();
  const [clock, setClock] = useState('');
  const info = pageTitles[page] || pageTitles.dashboard;

  useEffect(() => {
    const tick = () => {
      setClock(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) + ' IST');
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 h-[62px] bg-card/90 backdrop-blur-xl border-b border-border flex items-center px-7 gap-3 z-40 transition-all ${
        sidebarCollapsed ? 'left-16' : 'left-[252px]'
      }`}
    >
      <div>
        <h2 className="font-display text-lg font-extrabold text-foreground tracking-tight">{info.title}</h2>
        <p className="text-[11px] text-t3 tracking-wide">{info.sub}</p>
      </div>
      <div className="flex-1" />

      {/* Market pill */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold border bg-red/5 border-red/20 text-red">
        <div className="w-1.5 h-1.5 rounded-full bg-red" />
        <span>Market Closed</span>
      </div>

      {/* Clock */}
      <div className="font-mono text-xs text-primary bg-primary/5 border border-primary/15 px-3.5 py-1.5 rounded-lg tracking-wide">
        {clock}
      </div>

      <button className="h-[34px] px-4 rounded-[9px] text-xs font-semibold bg-accent border border-border text-t2 hover:border-primary/30 hover:text-primary transition-all">
        ⏸ Pause
      </button>
      <button className="h-[34px] px-4 rounded-[9px] text-xs font-semibold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md hover:shadow-lg transition-all">
        ↺ Refresh
      </button>
    </header>
  );
};

export default Topbar;
