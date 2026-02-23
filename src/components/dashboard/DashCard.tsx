import { ReactNode } from 'react';

interface DashCardProps {
  title?: string;
  titleColor?: string;
  chip?: { text: string; color: string };
  accentColor?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

const accentMap: Record<string, string> = {
  cyan: 'from-transparent via-cyan to-transparent',
  green: 'from-transparent via-green-bright to-transparent',
  amber: 'from-transparent via-amber to-transparent',
  red: 'from-transparent via-red to-transparent',
  purple: 'from-transparent via-purple to-transparent',
};

const chipColorMap: Record<string, string> = {
  cyan: 'bg-cyan/10 text-cyan border-cyan/25',
  green: 'bg-green/10 text-green-bright border-green/25',
  amber: 'bg-amber/10 text-amber border-amber/25',
  red: 'bg-red/10 text-red border-red/25',
  purple: 'bg-purple/10 text-purple border-purple/25',
  dim: 'bg-muted text-t2 border-border',
};

const DashCard = ({ title, titleColor, chip, accentColor, action, children, className = '' }: DashCardProps) => {
  return (
    <div className={`bg-card border border-border rounded-lg p-5 relative overflow-hidden transition-all hover:border-primary/20 hover:shadow-lg hover:-translate-y-0.5 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <span className={`text-[10px] font-bold tracking-[1.8px] uppercase ${titleColor || 'text-t3'}`}>
            {title}
          </span>
          <div className="flex items-center gap-2">
            {chip && (
              <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wide uppercase border ${chipColorMap[chip.color] || chipColorMap.dim}`}>
                {chip.text}
              </span>
            )}
            {action}
          </div>
        </div>
      )}
      {children}
      {accentColor && (
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${accentMap[accentColor] || ''} opacity-60`} />
      )}
    </div>
  );
};

export default DashCard;
