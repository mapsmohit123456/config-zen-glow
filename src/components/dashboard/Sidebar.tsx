import { useDashboardStore } from '@/store/dashboardStore';

const navItems = [
  { section: 'Main', items: [
    { id: 'dashboard', icon: '▦', label: 'Dashboard' },
    { id: 'positions', icon: '◈', label: 'Positions' },
    { id: 'configure', icon: '◎', label: 'Configure' },
  ]},
  { section: 'Analytics', items: [
    { id: 'performance', icon: '◫', label: 'Performance' },
    { id: 'logs', icon: '≡', label: 'Trade Logs' },
    { id: 'risk', icon: '◉', label: 'Risk Monitor' },
  ]},
];

const Sidebar = () => {
  const { page, setPage, sidebarCollapsed, toggleSidebar, live } = useDashboardStore();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-card border-r border-border flex flex-col z-50 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-[252px]'
      }`}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 h-[62px] border-b border-border flex-shrink-0">
        <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-primary to-cyan flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0 shadow-md">
          ⚡
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <h1 className="font-display text-base font-extrabold tracking-tight text-foreground leading-tight">
              PyraBot Pro
            </h1>
            <span className="text-[10px] text-t3 tracking-[2px] uppercase font-medium">
              NIFTY · BANKNIFTY
            </span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="ml-auto w-7 h-7 flex items-center justify-center rounded-lg hover:bg-accent text-t3 hover:text-primary transition-colors flex-shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`}>
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {navItems.map(({ section, items }) => (
          <div key={section}>
            {!sidebarCollapsed && (
              <div className="text-[9px] font-bold tracking-[2.5px] uppercase text-t4 px-[18px] pt-3.5 pb-1.5">
                {section}
              </div>
            )}
            {items.map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => setPage(id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 mx-2 rounded-[10px] text-[13px] font-medium transition-all relative border border-transparent ${
                  page === id
                    ? 'bg-primary/10 border-primary/20 text-primary'
                    : 'text-t2 hover:bg-accent hover:text-foreground'
                }`}
              >
                {page === id && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-gradient-to-b from-primary to-cyan rounded-r-sm" />
                )}
                <span className="text-base flex-shrink-0 w-[22px] text-center">{icon}</span>
                {!sidebarCollapsed && <span>{label}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && (
        <div className="p-3.5 border-t border-border flex-shrink-0">
          <div className="bg-accent/60 border border-border rounded-lg p-3">
            <div className="text-[9px] tracking-[1.8px] uppercase text-t3 mb-2 font-bold">Bot Status</div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                live ? 'bg-green-bright pulse-live' : 'bg-amber'
              }`} />
              <span className="text-xs font-semibold text-foreground">
                {live ? 'Bot Running — Live' : 'Offline — No Server'}
              </span>
            </div>
            <div className="text-[10px] text-t3 mt-1 font-mono">Uptime: —</div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
