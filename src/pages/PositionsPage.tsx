import DashCard from '@/components/dashboard/DashCard';

const PositionsPage = () => {
  return (
    <div className="flex flex-col gap-5">
      <DashCard>
        <div className="flex flex-col items-center justify-center py-16 text-t3 gap-3">
          <div className="text-5xl opacity-30">◈</div>
          <div className="text-sm font-semibold text-t2">No Positions</div>
          <div className="text-xs">Active and historical positions will appear here when the bot executes trades.</div>
        </div>
      </DashCard>
    </div>
  );
};

export default PositionsPage;
