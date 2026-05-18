import type { ReactNode } from 'react';


interface DashboardCardProps {
  titulo: string;
  valor: string | number;
  badge: string;
  descricao: string;
  icone?: ReactNode;
  accentClassName?: string;
  iconClassName?: string;
  badgeClassName?: string;
  className?: string;
}

export default function DashboardCard({
  titulo,
  valor,
  badge,
  descricao,
  icone,
  accentClassName = 'bg-[#eef5d9] text-[#6c8f1a]',
  iconClassName = 'h-5 w-5',
  badgeClassName = 'bg-[#eef5d9] text-[#6c8f1a]',
  className,
}: DashboardCardProps) {
  return (
    <div className={`rounded-[24px] border border-[#e9e8df] bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.02)] ${className ?? ''}`.trim()}>
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${accentClassName}`}>
        {icone && <span className={iconClassName}>{icone}</span>}
      </div>

      <h3 className="mt-7 text-[15px] font-medium text-[#50606d]">{titulo}</h3>
      <p className="mt-2 text-5xl font-semibold tracking-[-0.05em] text-slate-950">{valor}</p>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-[#7b8677]">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${badgeClassName}`}>
          {badge}
        </span>
        <span className="text-[#7d8378]">•</span>
        <span className="leading-6">{descricao}</span>
      </div>
    </div>
  );
}