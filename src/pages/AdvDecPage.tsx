import DashCard from '@/components/dashboard/DashCard';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';

// Mock historical A/D data for the 3 market types
const generateADData = () => {
  const times = ['09:15','09:30','09:45','10:00','10:15','10:30','10:45','11:00','11:15','11:30','11:45','12:00','12:15','12:30','12:45','13:00','13:15','13:30','13:45','14:00','14:15','14:30','14:45','15:00','15:15','15:30'];
  return times.map((t, i) => {
    const base = Math.sin(i * 0.3) * 10;
    return {
      time: t,
      niftyAdv: Math.round(25 + base + Math.random() * 8),
      niftyDec: Math.round(25 - base + Math.random() * 8),
      bankAdv: Math.round(6 + base * 0.4 + Math.random() * 3),
      bankDec: Math.round(6 - base * 0.4 + Math.random() * 3),
      broadAdv: Math.round(250 + base * 15 + Math.random() * 40),
      broadDec: Math.round(250 - base * 15 + Math.random() * 40),
    };
  });
};

const adData = generateADData();

// Derive latest snapshot
const latest = adData[adData.length - 1];

interface ADSummary {
  label: string;
  advancing: number;
  declining: number;
  unchanged: number;
  ratio: string;
  color: string;
}

const summaries: ADSummary[] = [
  {
    label: 'Nifty 50',
    advancing: latest.niftyAdv,
    declining: latest.niftyDec,
    unchanged: 50 - latest.niftyAdv - latest.niftyDec,
    ratio: (latest.niftyAdv / Math.max(latest.niftyDec, 1)).toFixed(2),
    color: 'cyan',
  },
  {
    label: 'Bank Nifty',
    advancing: latest.bankAdv,
    declining: latest.bankDec,
    unchanged: 12 - latest.bankAdv - latest.bankDec,
    ratio: (latest.bankAdv / Math.max(latest.bankDec, 1)).toFixed(2),
    color: 'green',
  },
  {
    label: 'Broad Market',
    advancing: latest.broadAdv,
    declining: latest.broadDec,
    unchanged: Math.max(0, 500 - latest.broadAdv - latest.broadDec),
    ratio: (latest.broadAdv / Math.max(latest.broadDec, 1)).toFixed(2),
    color: 'purple',
  },
];

// A/D line data (cumulative)
const adLineData = adData.map((d, i) => {
  const prev = i > 0 ? adData.slice(0, i).reduce((acc, p) => ({
    nifty: acc.nifty + (p.niftyAdv - p.niftyDec),
    bank: acc.bank + (p.bankAdv - p.bankDec),
    broad: acc.broad + (p.broadAdv - p.broadDec),
  }), { nifty: 0, bank: 0, broad: 0 }) : { nifty: 0, bank: 0, broad: 0 };
  return {
    time: d.time,
    niftyADLine: prev.nifty + (d.niftyAdv - d.niftyDec),
    bankADLine: prev.bank + (d.bankAdv - d.bankDec),
    broadADLine: prev.broad + (d.broadAdv - d.broadDec),
  };
});

// Top 8 stocks behavior
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

const trendColors: Record<string, string> = {
  up: 'text-green-600 bg-green-50 border-green-200',
  down: 'text-red-600 bg-red-50 border-red-200',
  sideways: 'text-amber-600 bg-amber-50 border-amber-200',
};

const trendLabels: Record<string, string> = {
  up: '▲ Uptrend',
  down: '▼ Downtrend',
  sideways: '► Sideways',
};

const AdvDecPage = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground tracking-tight">Advance / Decline Analysis</h2>
        <p className="text-sm text-muted-foreground mt-1">Market breadth across Nifty 50, Bank Nifty & Broad Market</p>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaries.map((s) => {
          const isPositive = s.advancing > s.declining;
          return (
            <DashCard key={s.label} title={s.label} accentColor={s.color}>
              <div className="space-y-3">
                {/* A/D Bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden flex">
                    <div
                      className="h-full bg-green-500 rounded-l-full transition-all"
                      style={{ width: `${(s.advancing / (s.advancing + s.declining + Math.max(s.unchanged, 0))) * 100}%` }}
                    />
                    <div
                      className="h-full bg-red-500 rounded-r-full transition-all"
                      style={{ width: `${(s.declining / (s.advancing + s.declining + Math.max(s.unchanged, 0))) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600">{s.advancing}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Advancing</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-600">{s.declining}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Declining</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-muted-foreground">{Math.max(s.unchanged, 0)}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Unchanged</div>
                  </div>
                </div>

                {/* Ratio */}
                <div className="flex items-center justify-between pt-1 border-t border-border">
                  <span className="text-xs text-muted-foreground font-medium">A/D Ratio</span>
                  <span className={`text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {s.ratio}
                  </span>
                </div>
              </div>
            </DashCard>
          );
        })}
      </div>

      {/* Line Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Advance/Decline Count Chart */}
        <DashCard title="Intraday A/D Count" accentColor="cyan">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={adData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="niftyAdv" name="Nifty Adv" stroke="#16a34a" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="niftyDec" name="Nifty Dec" stroke="#dc2626" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="bankAdv" name="BankNifty Adv" stroke="#059669" strokeWidth={1.5} dot={false} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="bankDec" name="BankNifty Dec" stroke="#e11d48" strokeWidth={1.5} dot={false} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashCard>

        {/* Cumulative A/D Line Chart */}
        <DashCard title="Cumulative A/D Line" accentColor="purple">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={adLineData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="niftyADLine" name="Nifty 50" stroke="#0891b2" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="bankADLine" name="Bank Nifty" stroke="#7c3aed" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="broadADLine" name="Broad Market" stroke="#d97706" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashCard>

        {/* Broad Market A/D Chart */}
        <DashCard title="Broad Market A/D Spread" accentColor="green" className="lg:col-span-2">
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={adData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="broadAdv" name="Broad Advancing" stroke="#16a34a" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="broadDec" name="Broad Declining" stroke="#dc2626" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashCard>
      </div>

      {/* Top 8 Stocks Behavior */}
      <DashCard title="Nifty Top 8 — Trend Behavior" accentColor="cyan">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2.5 px-3 text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Stock</th>
                <th className="text-center py-2.5 px-3 text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Weight</th>
                <th className="text-center py-2.5 px-3 text-[10px] font-bold tracking-wider uppercase text-muted-foreground">Current</th>
                <th className="text-center py-2.5 px-3 text-[10px] font-bold tracking-wider uppercase text-muted-foreground" colSpan={3}>
                  <span className="text-green-600">▲ Uptrend Behavior</span>
                </th>
                <th className="text-center py-2.5 px-3 text-[10px] font-bold tracking-wider uppercase text-muted-foreground" colSpan={3}>
                  <span className="text-red-600">▼ Downtrend Behavior</span>
                </th>
              </tr>
              <tr className="border-b border-border/50">
                <th className="py-1" colSpan={3}></th>
                <th className="text-center py-1 px-2 text-[9px] text-muted-foreground font-medium">Avg Ret</th>
                <th className="text-center py-1 px-2 text-[9px] text-muted-foreground font-medium">Win %</th>
                <th className="text-center py-1 px-2 text-[9px] text-muted-foreground font-medium">Vol</th>
                <th className="text-center py-1 px-2 text-[9px] text-muted-foreground font-medium">Avg Ret</th>
                <th className="text-center py-1 px-2 text-[9px] text-muted-foreground font-medium">Win %</th>
                <th className="text-center py-1 px-2 text-[9px] text-muted-foreground font-medium">Vol</th>
              </tr>
            </thead>
            <tbody>
              {top8Stocks.map((stock) => (
                <tr key={stock.symbol} className="border-b border-border/30 hover:bg-accent/50 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-foreground">{stock.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{stock.symbol}</div>
                  </td>
                  <td className="text-center py-2.5 px-3 text-xs font-medium text-muted-foreground">{stock.weight}</td>
                  <td className="text-center py-2.5 px-3">
                    <div className="inline-flex flex-col items-center gap-0.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${trendColors[stock.currentTrend]}`}>
                        {trendLabels[stock.currentTrend]}
                      </span>
                      <span className={`text-xs font-mono font-semibold ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change}%
                      </span>
                    </div>
                  </td>
                  {/* Uptrend */}
                  <td className="text-center py-2.5 px-2 text-xs font-mono text-green-600 font-medium">{stock.upTrend.avgReturn}</td>
                  <td className="text-center py-2.5 px-2 text-xs font-mono text-foreground">{stock.upTrend.winRate}</td>
                  <td className="text-center py-2.5 px-2 text-xs font-mono text-muted-foreground">{stock.upTrend.avgVolume}</td>
                  {/* Downtrend */}
                  <td className="text-center py-2.5 px-2 text-xs font-mono text-red-600 font-medium">{stock.downTrend.avgReturn}</td>
                  <td className="text-center py-2.5 px-2 text-xs font-mono text-foreground">{stock.downTrend.winRate}</td>
                  <td className="text-center py-2.5 px-2 text-xs font-mono text-muted-foreground">{stock.downTrend.avgVolume}</td>
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
