import DashCard from '@/components/dashboard/DashCard';

const RiskPage = () => {
  return (
    <div className="grid grid-cols-3 gap-5">
      <DashCard>
        <div className="font-display text-[15px] font-bold mb-4">◉ Risk Overview</div>
        <div className="h-2 rounded-full bg-gradient-to-r from-green-bright via-amber to-red relative mb-1.5 shadow-inner">
          <div className="absolute -top-1 w-[3px] h-4 bg-foreground rounded-sm shadow-md transition-all" style={{ left: '0%' }} />
        </div>
        <div className="flex justify-between text-[10px] text-t3 mb-4">
          <span>Safe</span><span>Moderate</span><span>High</span>
        </div>
        <div className="space-y-0">
          {[
            ['Max Positions', '1 (enforced)'],
            ['Stages Active', '0/3'],
            ['Capital Deployed', '₹0'],
            ['Bot Mode', '—'],
          ].map(([l, v]) => (
            <div key={l} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
              <span className="text-xs text-t2">{l}</span>
              <span className="text-xs font-bold font-mono">{v}</span>
            </div>
          ))}
        </div>
      </DashCard>
      <DashCard className="col-span-2">
        <div className="font-display text-[15px] font-bold mb-4">🏦 Capital Breakdown</div>
        <div className="flex flex-col items-center justify-center py-12 text-t3 gap-3">
          <div className="text-4xl opacity-30">💰</div>
          <div className="text-sm font-semibold text-t2">No active position</div>
        </div>
      </DashCard>
    </div>
  );
};

export default RiskPage;
