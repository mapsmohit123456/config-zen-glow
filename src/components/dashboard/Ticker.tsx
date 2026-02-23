const Ticker = () => {
  const tickers = [
    { sym: 'NIFTY 50', px: '24,850.25', ch: '+0.42%', up: true },
    { sym: 'BANK NIFTY', px: '51,230.50', ch: '-0.18%', up: false },
    { sym: 'SENSEX', px: '81,462.30', ch: '+0.35%', up: true },
    { sym: 'FIN NIFTY', px: '23,120.75', ch: '+0.28%', up: true },
    { sym: 'INDIA VIX', px: '13.45', ch: '-2.10%', up: false },
    { sym: 'USD/INR', px: '83.42', ch: '+0.05%', up: true },
  ];

  const doubled = [...tickers, ...tickers];

  return (
    <div className="bg-card border-b border-border h-8 overflow-hidden flex items-center relative">
      <div className="absolute left-0 top-0 bottom-0 w-14 bg-gradient-to-r from-card to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-14 bg-gradient-to-l from-card to-transparent z-10" />
      <div className="flex gap-12 whitespace-nowrap ticker-animate px-14 font-mono text-[11px]">
        {doubled.map((t, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="font-bold text-t2 tracking-wide text-[10px] uppercase">{t.sym}</span>
            <span className="text-foreground font-semibold">{t.px}</span>
            <span className={t.up ? 'text-green-bright font-semibold' : 'text-red font-semibold'}>{t.ch}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
