import DashCard from '@/components/dashboard/DashCard';
import { useDashboardStore } from '@/store/dashboardStore';

const logColors: Record<string, string> = {
  info: 'bg-cyan',
  success: 'bg-green-bright',
  warn: 'bg-amber',
  error: 'bg-red',
};

const LogsPage = () => {
  const { logs, clearLogs } = useDashboardStore();

  return (
    <DashCard>
      <div className="flex items-center justify-between mb-4">
        <div className="font-display text-[15px] font-bold">📝 Trade Execution Log</div>
        <button onClick={clearLogs} className="h-7 px-3 rounded-lg text-[11px] font-semibold bg-accent border border-border text-t2 hover:border-red/30 hover:text-red transition-all">
          Clear
        </button>
      </div>
      <div className="max-h-[600px] overflow-y-auto">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-t3 gap-3">
            <div className="text-4xl opacity-30">📝</div>
            <div className="text-sm font-semibold text-t2">No logs yet</div>
          </div>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${logColors[log.type] || 'bg-cyan'}`} />
              <div className="text-xs leading-relaxed flex-1">{log.msg}</div>
              <div className="text-[10px] text-t3 font-mono whitespace-nowrap">{log.time}</div>
            </div>
          ))
        )}
      </div>
    </DashCard>
  );
};

export default LogsPage;
