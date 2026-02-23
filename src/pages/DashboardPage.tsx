import DashCard from '@/components/dashboard/DashCard';

const kpis = [
  { title: 'Active Positions', value: '0', sub: 'Max 1 at a time', icon: '◈', accent: 'cyan', color: 'text-cyan' },
  { title: 'Pending Config', value: '0', sub: 'Awaiting activation', icon: '⏳', accent: 'amber', color: 'text-amber' },
  { title: 'Current Stage', value: '—', sub: 'of 3 pyramid stages', icon: '▲', accent: 'purple', color: 'text-purple' },
  { title: 'Profit Target', value: '—', sub: 'Premium pricing target', icon: '◎', accent: 'green', color: 'text-green-bright' },
  { title: "Today's P&L", value: '₹0', sub: 'Realized today', icon: '◫', accent: 'green', color: 'text-green-bright' },
];

const globalFutures = [
  { label: 'SGX Nifty', value: '—', sub: 'loading…' },
  { label: 'Dow Futures', value: '—', sub: 'loading…' },
  { label: 'S&P 500 Fut', value: '—', sub: 'loading…' },
  { label: 'Nasdaq Fut', value: '—', sub: 'loading…' },
  { label: 'Nikkei 225', value: '—', sub: 'loading…' },
  { label: 'Hang Seng', value: '—', sub: 'loading…' },
  { label: 'USD/INR', value: '—', sub: 'loading…' },
  { label: 'India VIX', value: '—', sub: 'loading…' },
];

const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-5">
      {/* Market banner */}
      <div className="flex items-center justify-between px-4 py-3 rounded-lg text-xs font-semibold border bg-red/5 border-red/20 text-red">
        <span>🔴 Market Closed — NSE F&O</span>
        <span className="text-t2 font-normal font-mono text-[11px]">NSE F&O · 9:15 AM – 3:30 PM IST</span>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-4">
        {kpis.map((k) => (
          <DashCard key={k.title} accentColor={k.accent}>
            <div className="text-[10px] font-bold tracking-[1.8px] uppercase text-t3 mb-2">{k.title}</div>
            <div className={`font-display text-3xl font-black leading-none mb-1 tracking-tight ${k.color}`}>{k.value}</div>
            <div className="text-[11px] text-t3">{k.sub}</div>
            <div className="absolute right-4 top-4 text-2xl opacity-5">{k.icon}</div>
          </DashCard>
        ))}
      </div>

      {/* No active position */}
      <DashCard>
        <div className="flex flex-col items-center justify-center py-12 text-t3 gap-3">
          <div className="text-5xl opacity-30">🤖</div>
          <div className="text-sm font-semibold text-t2">No Active Position</div>
          <div className="text-xs">Bot is monitoring CSV for TradingView signals…</div>
        </div>
      </DashCard>

      {/* User Insights */}
      <DashCard title="💡 User Insights" titleColor="text-purple" chip={{ text: 'Ready', color: 'purple' }} accentColor="purple"
        action={<button className="text-[11px] font-semibold px-3 py-1 rounded-lg bg-accent border border-border text-t2 hover:border-purple/30 hover:text-purple transition-all">💾 Save</button>}
      >
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">📊 Observation Value</label>
            <input type="number" step="0.01" placeholder="0.00" className="px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-purple/40 focus:ring-2 focus:ring-purple/10 outline-none transition-all" />
            <span className="text-[10px] text-t3 italic">Float value (overwrites on save)</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">📈 Next Day Sentiment</label>
            <select className="px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-purple/40 focus:ring-2 focus:ring-purple/10 outline-none transition-all">
              <option>Neutral</option>
              <option>Bullish</option>
              <option>Bearish</option>
            </select>
            <span className="text-[10px] text-t3 italic">Market outlook for tomorrow</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">🎯 Hurdle Point</label>
            <input type="number" step="0.01" placeholder="0.00" className="px-3 py-2.5 bg-accent/50 border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-purple/40 focus:ring-2 focus:ring-purple/10 outline-none transition-all" />
            <span className="text-[10px] text-t3 italic">Key level to watch</span>
          </div>
        </div>
        <div className="bg-accent/40 rounded-[10px] p-4 border border-border">
          <div className="text-[10px] font-bold tracking-[1.2px] uppercase text-t3 mb-2.5">📍 Pre-Open Range</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[11px] text-t3 mb-1">Low</div>
              <input type="number" step="0.01" placeholder="0.00" className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-purple/40 focus:ring-2 focus:ring-purple/10 outline-none transition-all" />
            </div>
            <div>
              <div className="text-[11px] text-t3 mb-1">High</div>
              <input type="number" step="0.01" placeholder="0.00" className="w-full px-3 py-2.5 bg-card border border-border rounded-lg text-foreground text-[13px] font-mono focus:border-purple/40 focus:ring-2 focus:ring-purple/10 outline-none transition-all" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-[10px] text-t3 font-mono">Last saved: —</span>
        </div>
      </DashCard>

      {/* Global Cues */}
      <DashCard title="🌐 Global Cues — Pre-Market" titleColor="text-cyan" chip={{ text: 'Loading…', color: 'cyan' }} accentColor="cyan"
        action={<button className="text-[11px] font-semibold px-3 py-1 rounded-lg bg-accent border border-border text-t2 hover:border-cyan/30 hover:text-cyan transition-all">↺ Refresh</button>}
      >
        <div className="grid grid-cols-4 gap-3 mb-4">
          {globalFutures.map((f) => (
            <div key={f.label} className="bg-accent/40 border border-border rounded-lg p-3.5 transition-all hover:border-primary/20 hover:-translate-y-0.5">
              <div className="text-[9px] font-bold tracking-[1.8px] uppercase text-t3 mb-1.5">{f.label}</div>
              <div className="font-display text-base font-extrabold leading-none">{f.value}</div>
              <div className="text-[10px] text-t3 mt-1 font-mono">{f.sub}</div>
            </div>
          ))}
        </div>

        {/* FII/DII + News */}
        <div className="grid grid-cols-[1fr_2fr] gap-4 mt-4">
          <div>
            <div className="text-[10px] font-bold tracking-[1.2px] uppercase text-t3 mb-2">FII / DII Activity (Provisional)</div>
            <div className="flex gap-2.5">
              <div className="flex-1 bg-cyan/5 border border-cyan/15 rounded-lg p-3">
                <div className="text-[9px] tracking-[1.8px] uppercase text-cyan font-bold mb-1">FII Net</div>
                <div className="font-display text-xl font-black text-cyan">—</div>
                <div className="text-[10px] font-mono text-t2 mt-1">Buy: — · Sell: —</div>
              </div>
              <div className="flex-1 bg-purple/5 border border-purple/15 rounded-lg p-3">
                <div className="text-[9px] tracking-[1.8px] uppercase text-purple font-bold mb-1">DII Net</div>
                <div className="font-display text-xl font-black text-purple">—</div>
                <div className="text-[10px] font-mono text-t2 mt-1">Buy: — · Sell: —</div>
              </div>
            </div>
            <div className="mt-3.5">
              <div className="text-[10px] font-bold tracking-[1.2px] uppercase text-t3 mb-2">F&O Ban Period Stocks</div>
              <span className="inline-flex text-[11px] font-bold px-2.5 py-1 rounded-full bg-green/10 text-green-bright border border-green/25">✅ No stocks in ban period</span>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-[10px] font-bold tracking-[1.2px] uppercase text-t3">📰 Market Intelligence</div>
              <button className="text-[11px] font-semibold px-3 py-1 rounded-lg bg-accent border border-border text-t2 hover:border-cyan/30 hover:text-cyan transition-all">↺ Refresh</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-3 bg-accent/40 rounded-[10px] border border-border">
                <span className="text-lg opacity-40">📡</span>
                <span className="text-[11px] text-t3">Loading market intelligence…</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-[10px] text-t3 font-mono">Last updated: —</span>
          <span className="text-[10px] text-t3">Auto-refreshes at 8:45 AM IST</span>
        </div>
      </DashCard>

      {/* Market Breadth + Sector row */}
      <div className="grid grid-cols-[1.5fr_1fr] gap-4">
        {/* Advance/Decline */}
        <DashCard title="📊 Market Breadth — Advance/Decline" titleColor="text-purple" chip={{ text: 'Offline', color: 'amber' }} accentColor="purple">
          <div className="grid grid-cols-3 gap-3.5">
            {['NIFTY 50', 'NIFTY 200', 'NIFTY 500'].map((name) => (
              <div key={name} className="relative">
                <div className="text-[10px] font-bold tracking-[1.8px] uppercase text-t3 mb-2">{name}</div>
                <div className="font-display text-3xl font-black text-center py-2.5 text-t2">0.00</div>
                <div className="text-[10px] text-t3 text-center mb-2.5">Advance / Decline</div>
                <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mb-2">
                  <div className="bg-gradient-to-r from-green to-green-bright rounded-l-full" style={{ width: '33%' }} />
                  <div className="bg-t4" style={{ width: '34%' }} />
                  <div className="bg-gradient-to-r from-red to-red rounded-r-full" style={{ width: '33%' }} />
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-green-bright font-mono font-bold">0</span>
                  <span className="text-t3 font-mono">0</span>
                  <span className="text-red font-mono font-bold">0</span>
                </div>
              </div>
            ))}
          </div>
        </DashCard>

        {/* Sector Performance */}
        <DashCard title="📈 Sector Performance" titleColor="text-green-bright" chip={{ text: 'Offline', color: 'amber' }} accentColor="green">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-[13px] font-bold text-foreground mb-3 pb-2 border-b border-border">🟢 Strongest</h4>
              <div className="text-[11px] text-t3 italic">Loading…</div>
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-foreground mb-3 pb-2 border-b border-border">🔴 Weakest</h4>
              <div className="text-[11px] text-t3 italic">Loading…</div>
            </div>
          </div>
        </DashCard>
      </div>

      {/* Bottom row: Activity + Config Summary + Risk */}
      <div className="grid grid-cols-3 gap-4">
        <DashCard title="⚡ Activity Feed" chip={{ text: 'Live', color: 'green' }}>
          <div className="flex items-start gap-3 py-2 border-b border-border last:border-0">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan flex-shrink-0 mt-1.5" />
            <div className="text-xs leading-relaxed flex-1">PyraBot Pro Dashboard started — connecting to server…</div>
            <div className="text-[10px] text-t3 font-mono whitespace-nowrap">{new Date().toLocaleTimeString('en-IN')}</div>
          </div>
        </DashCard>

        <DashCard title="⚙ Quick Config" chip={{ text: 'Summary', color: 'dim' }}>
          <div className="space-y-0">
            {[
              ['CSV File', 'tv_data.csv'],
              ['Poll', '5 sec'],
              ['Mode', '✅ Auto'],
              ['Max Pos', '1'],
            ].map(([l, v]) => (
              <div key={l} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-xs text-t2">{l}</span>
                <span className="text-xs font-bold font-mono">{v}</span>
              </div>
            ))}
          </div>
        </DashCard>

        <DashCard title="◉ Risk Snapshot" chip={{ text: '—', color: 'dim' }}>
          <div className="text-[11px] text-t3 mb-1">Capital Deployment</div>
          <div className="h-2 rounded-full bg-gradient-to-r from-green-bright via-amber to-red relative mb-1.5 shadow-inner">
            <div className="absolute -top-1 w-[3px] h-4 bg-foreground rounded-sm" style={{ left: '0%' }} />
          </div>
          <div className="flex justify-between text-[10px] text-t3 mb-3">
            <span>0%</span><span>50%</span><span>100%</span>
          </div>
          {[
            ['Stages Deployed', '0/3'],
            ['Capital In', '₹0'],
            ['Pyramid Type', '15→30→55%'],
          ].map(([l, v]) => (
            <div key={l} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-xs text-t2">{l}</span>
              <span className="text-xs font-bold font-mono">{v}</span>
            </div>
          ))}
        </DashCard>
      </div>
    </div>
  );
};

export default DashboardPage;
