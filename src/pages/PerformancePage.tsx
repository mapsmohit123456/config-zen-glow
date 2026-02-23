import DashCard from '@/components/dashboard/DashCard';

const PerformancePage = () => {
  return (
    <div className="grid grid-cols-3 gap-5">
      <DashCard>
        <div className="font-display text-[15px] font-bold mb-4">📊 Session Stats</div>
        <div className="flex flex-col items-center justify-center py-10 text-t3 gap-3">
          <div className="text-4xl opacity-30">📭</div>
          <div className="text-sm font-semibold text-t2">No completed trades</div>
        </div>
      </DashCard>
      <DashCard className="col-span-2">
        <div className="font-display text-[15px] font-bold mb-4">📋 Trade History</div>
        <div className="flex flex-col items-center justify-center py-10 text-t3 gap-3">
          <div className="text-4xl opacity-30">📊</div>
          <div className="text-sm font-semibold text-t2">Completed trades will appear here</div>
        </div>
      </DashCard>
    </div>
  );
};

export default PerformancePage;
