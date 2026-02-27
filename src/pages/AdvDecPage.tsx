import DashCard from '@/components/dashboard/DashCard';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';

// Mock historical A/D data for the 3 indices matching Dashboard
const generateADData = () => {
  const times = ['09:15','09:30','09:45','10:00','10:15','10:30','10:45','11:00','11:15','11:30','11:45','12:00','12:15','12:30','12:45','13:00','13:15','13:30','13:45','14:00','14:15','14:30','14:45','15:00','15:15','15:30'];
  return times.map((t, i) => {
    const base = Math.sin(i * 0.3) * 10;
    return {
      time: t,
      nifty50Adv: Math.round(25 + base + Math.random() * 8),
      nifty50Dec: Math.round(25 - base + Math.random() * 8),
      nifty200Adv: Math.round(100 + base * 6 + Math.random() * 20),
      nifty200Dec: Math.round(100 - base * 6 + Math.random() * 20),
      nifty500Adv: Math.round(250 + base * 15 + Math.random() * 40),
      nifty500Dec: Math.round(250 - base * 15 + Math.random() * 40),
    };
  });
};

const adData = generateADData();
const latest = adData[adData.length - 1];

interface ADSummary {
  label: string;
  total: number;
  advancing: number;
  declining: number;
  unchanged: number;
  ratio: string;
  accent: string;
}

const summaries: ADSummary[] = [
  {
    label: 'NIFTY 50',
    total: 50,
    advancing: latest.nifty50Adv,
    declining: latest.nifty50Dec,
    unchanged: Math.max(0, 50 - latest.nifty50Adv - latest.nifty50Dec),
    ratio: (latest.nifty50Adv / Math.max(latest.nifty50Dec, 1)).toFixed(2),
    accent: 'cyan',
  },
  {
    label: 'NIFTY 200',
    total: 200,
    advancing: latest.nifty200Adv,
    declining: latest.nifty200Dec,
    unchanged: Math.max(0, 200 - latest.nifty200Adv - latest.nifty200Dec),
    ratio: (latest.nifty200Adv / Math.max(latest.nifty200Dec, 1)).toFixed(2),
    accent: 'purple',
  },
  {
    label: 'NIFTY 500',
    total: 500,
    advancing: latest.nifty500Adv,
    declining: latest.nifty500Dec,
    unchanged: Math.max(0, 500 - latest.nifty500Adv - latest.nifty500Dec),
    ratio: (latest.nifty500Adv / Math.max(latest.nifty500Dec, 1)).toFixed(2),
    accent: 'green',
  },
];

// Cumulative A/D line data
const adLineData = adData.map((d, i) => {
  const prev = i > 0 ? adData.slice(0, i).reduce((acc, p) => ({
    n50: acc.n50 + (p.nifty50Adv - p.nifty50Dec),
    n200: acc.n200 + (p.nifty200Adv - p.nifty200Dec),
    n500: acc.n500 + (p.nifty500Adv - p.nifty500Dec),
  }), { n50: 0, n200: 0, n500: 0 }) : { n50: 0, n200: 0, n500: 0 };
  return {
    time: d.time,
    nifty50AD: prev.n50 + (d.nifty50Adv - d.nifty50Dec),
    nifty200AD: prev.n200 + (d.nifty200Adv - d.nifty200Dec),
    nifty500AD: prev.n500 + (d.nifty500Adv - d.nifty500Dec),
  };
});

// Top 8 Nifty stocks by weight
interface StockBehavior {
  name: string;
  symbol: string;
  weight: string;
  upTrend: { avgReturn: string; winRate: string; avgVolume: string };
  downTrend: { avgReturn: string; winRate: string; avgVolume: string };
  currentTrend: 'up' | 'down' | 'sideways';
  change: number;
}

const top8Stocks: StockBehavior[] = [
  { name: 'Reliance', symbol: 'RELIANCE', weight: '10.2%', change: 1.23, currentTrend: 'up',
    upTrend: { avgReturn: '+1.8%', winRate: '72%', avgVolume: '12.4M' },
    downTrend: { avgReturn: '-1.2%', winRate: '38%', avgVolume: '18.1M' } },
  { name: 'TCS', symbol: 'TCS', weight: '4.1%', change: -0.45, currentTrend: 'down',
    upTrend: { avgReturn: '+1.1%', winRate: '65%', avgVolume: '4.2M' },
    downTrend: { avgReturn: '-0.9%', winRate: '42%', avgVolume: '5.8M' } },
  { name: 'HDFC Bank', symbol: 'HDFCBANK', weight: '8.5%', change: 0.87, currentTrend: 'up',
    upTrend: { avgReturn: '+1.5%', winRate: '70%', avgVolume: '8.3M' },
    downTrend: { avgReturn: '-1.4%', winRate: '35%', avgVolume: '11.2M' } },
  { name: 'Infosys', symbol: 'INFY', weight: '5.8%', change: -1.12, currentTrend: 'down',
    upTrend: { avgReturn: '+1.3%', winRate: '63%', avgVolume: '7.1M' },
    downTrend: { avgReturn: '-1.1%', winRate: '40%', avgVolume: '9.5M' } },
  { name: 'ICICI Bank', symbol: 'ICICIBANK', weight: '6.2%', change: 0.34, currentTrend: 'sideways',
    upTrend: { avgReturn: '+1.6%', winRate: '68%', avgVolume: '9.4M' },
    downTrend: { avgReturn: '-1.3%', winRate: '37%', avgVolume: '13.6M' } },
  { name: 'HUL', symbol: 'HINDUNILVR', weight: '2.9%', change: 0.56, currentTrend: 'up',
    upTrend: { avgReturn: '+0.9%', winRate: '60%', avgVolume: '3.1M' },
    downTrend: { avgReturn: '-0.7%', winRate: '45%', avgVolume: '4.2M' } },
  { name: 'SBI', symbol: 'SBIN', weight: '2.4%', change: 1.67, currentTrend: 'up',
    upTrend: { avgReturn: '+2.1%', winRate: '58%', avgVolume: '22.5M' },
    downTrend: { avgReturn: '-1.8%', winRate: '32%', avgVolume: '28.3M' } },
  { name: 'Bharti Airtel', symbol: 'BHARTIARTL', weight: '3.5%', change: -0.23, currentTrend: 'sideways',
    upTrend: { avgReturn: '+1.4%', winRate: '66%', avgVolume: '5.6M' },
    downTrend: { avgReturn: '-1.0%', winRate: '41%', avgVolume: '7.9M' } },
];

const trendBadge: Record<string, string> = {
  up: 'bg-green/10 text-green-bright border-green/25',
  down: 'bg-red/10 text-red border-red/25',
  sideways: 'bg-amber/10 text-amber border-amber/25',
};

const trendLabels: Record<string, string> = {
  up: '▲ Uptrend',
  down: '▼ Downtrend',
  sideways: '► Sideways',
};

const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 8,
  fontSize: 12,
};

const AdvDecPage = () => {
  return (
    <div className="flex flex-col gap-5">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground tracking-tight">📊 Advance / Decline Analysis</h2>
        <p className="text-sm text-t3 mt-1">Market breadth across NIFTY 50, NIFTY 200 & NIFTY 500</p>
      </div>

      {/* Top 3 A/D Summary — matching Dashboard breadth style */}
      <DashCard title="📊 Market Breadth — Advance/Decline" titleColor="text-purple" chip={{ text: 'Offline', color: 'amber' }} accentColor="purple">
        <div className="grid grid-cols-3 gap-3.5">
          {summaries.map((s) => {
            const isPositive = s.advancing > s.declining;
            return (
              <div key={s.label} className="relative">
                <div className="text-[10px] font-bold tracking-[1.8px] uppercase text-t3 mb-2">{s.label}</div>
                <div className={`font-display text-3xl font-black text-center py-2.5 ${isPositive ? 'text-green-bright' : 'text-red'}`}>
                  {s.ratio}
                </div>
                <div className="text-[10px] text-t3 text-center mb-2.5">Advance / Decline</div>
                <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mb-2">
                  <div
                    className="bg-gradient-to-r from-green to-green-bright rounded-l-full"
                    style={{ width: `${(s.advancing / s.total) * 100}%` }}
                  />
                  <div
                    className="bg-t4"
                    style={{ width: `${(s.unchanged / s.total) * 100}%` }}
                  />
                  <div
                    className="bg-gradient-to-r from-red to-red rounded-r-full"
                    style={{ width: `${(s.declining / s.total) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-green-bright font-mono font-bold">{s.advancing}</span>
                  <span className="text-t3 font-mono">{s.unchanged}</span>
                  <span className="text-red font-mono font-bold">{s.declining}</span>
                </div>
              </div>
            );
          })}
        </div>
      </DashCard>

      {/* Line Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Intraday A/D Count */}
        <DashCard title="Intraday A/D Count — NIFTY 50" accentColor="cyan">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={adData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="nifty50Adv" name="NIFTY 50 Adv" stroke="hsl(var(--green))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="nifty50Dec" name="NIFTY 50 Dec" stroke="hsl(var(--red))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashCard>

        {/* Cumulative A/D Line */}
        <DashCard title="Cumulative A/D Line" accentColor="purple">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={adLineData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="nifty50AD" name="NIFTY 50" stroke="hsl(var(--cyan))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="nifty200AD" name="NIFTY 200" stroke="hsl(var(--purple))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="nifty500AD" name="NIFTY 500" stroke="hsl(var(--amber))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashCard>

        {/* NIFTY 200 A/D */}
        <DashCard title="Intraday A/D Count — NIFTY 200" accentColor="purple">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={adData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="nifty200Adv" name="NIFTY 200 Adv" stroke="hsl(var(--green))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="nifty200Dec" name="NIFTY 200 Dec" stroke="hsl(var(--red))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashCard>

        {/* NIFTY 500 A/D */}
        <DashCard title="Intraday A/D Count — NIFTY 500" accentColor="green">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={adData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="nifty500Adv" name="NIFTY 500 Adv" stroke="hsl(var(--green))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="nifty500Dec" name="NIFTY 500 Dec" stroke="hsl(var(--red))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashCard>
      </div>

      {/* Top 8 Stocks Behavior */}
      <DashCard title="NIFTY Top 8 — Trend Behavior" accentColor="cyan">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2.5 px-3 text-[10px] font-bold tracking-[1.8px] uppercase text-t3">Stock</th>
                <th className="text-center py-2.5 px-3 text-[10px] font-bold tracking-[1.8px] uppercase text-t3">Weight</th>
                <th className="text-center py-2.5 px-3 text-[10px] font-bold tracking-[1.8px] uppercase text-t3">Current</th>
                <th className="text-center py-2.5 px-3 text-[10px] font-bold tracking-[1.8px] uppercase text-t3" colSpan={3}>
                  <span className="text-green-bright">▲ Uptrend Behavior</span>
                </th>
                <th className="text-center py-2.5 px-3 text-[10px] font-bold tracking-[1.8px] uppercase text-t3" colSpan={3}>
                  <span className="text-red">▼ Downtrend Behavior</span>
                </th>
              </tr>
              <tr className="border-b border-border/50">
                <th className="py-1" colSpan={3}></th>
                <th className="text-center py-1 px-2 text-[9px] text-t3 font-medium">Avg Ret</th>
                <th className="text-center py-1 px-2 text-[9px] text-t3 font-medium">Win %</th>
                <th className="text-center py-1 px-2 text-[9px] text-t3 font-medium">Vol</th>
                <th className="text-center py-1 px-2 text-[9px] text-t3 font-medium">Avg Ret</th>
                <th className="text-center py-1 px-2 text-[9px] text-t3 font-medium">Win %</th>
                <th className="text-center py-1 px-2 text-[9px] text-t3 font-medium">Vol</th>
              </tr>
            </thead>
            <tbody>
              {top8Stocks.map((stock) => (
                <tr key={stock.symbol} className="border-b border-border/30 hover:bg-accent/50 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-foreground">{stock.name}</div>
                    <div className="text-[10px] text-t3 font-mono">{stock.symbol}</div>
                  </td>
                  <td className="text-center py-2.5 px-3 text-xs font-medium text-t2">{stock.weight}</td>
                  <td className="text-center py-2.5 px-3">
                    <div className="inline-flex flex-col items-center gap-0.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${trendBadge[stock.currentTrend]}`}>
                        {trendLabels[stock.currentTrend]}
                      </span>
                      <span className={`text-xs font-mono font-semibold ${stock.change >= 0 ? 'text-green-bright' : 'text-red'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change}%
                      </span>
                    </div>
                  </td>
                  <td className="text-center py-2.5 px-2 text-xs font-mono text-green-bright font-medium">{stock.upTrend.avgReturn}</td>
                  <td className="text-center py-2.5 px-2 text-xs font-mono text-foreground">{stock.upTrend.winRate}</td>
                  <td className="text-center py-2.5 px-2 text-xs font-mono text-t2">{stock.upTrend.avgVolume}</td>
                  <td className="text-center py-2.5 px-2 text-xs font-mono text-red font-medium">{stock.downTrend.avgReturn}</td>
                  <td className="text-center py-2.5 px-2 text-xs font-mono text-foreground">{stock.downTrend.winRate}</td>
                  <td className="text-center py-2.5 px-2 text-xs font-mono text-t2">{stock.downTrend.avgVolume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashCard>
    </div>
  );
};

export default AdvDecPage;
