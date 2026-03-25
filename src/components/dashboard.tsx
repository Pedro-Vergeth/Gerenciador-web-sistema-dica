import type { ReactNode } from 'react';


interface DashboardCardProps {
  titulo: string;
  descricao: string;
  icone?: ReactNode;
  className?: string;
}

export default function DashboardCard({ titulo, descricao, icone, className }: DashboardCardProps) {
  return (
    <div className={`rounded-2xl border border-gray-100 bg-[#f7f7f7] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.14)] transition-shadow hover:shadow-md ${className ?? ''}`.trim()}>
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-gray-800">{titulo}</h3>
        
        {icone && (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-violet-600">
            {icone}
          </div>
        )}
      </div>

      <p className="text-gray-500 text-sm leading-relaxed">
        {descricao}
      </p>
    </div>
  );
}