import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: string; // Ex: 'blue', 'green', 'purple'
}

export function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  // Mapeamento de cores para classes do Tailwind
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 ring-blue-100',
    green: 'bg-green-50 text-green-600 ring-green-100',
    purple: 'bg-purple-50 text-purple-600 ring-purple-100',
    orange: 'bg-orange-50 text-orange-600 ring-orange-100',
  };

  const activeColor = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3.5 rounded-xl ${activeColor} ring-1 ring-inset`}>
          <Icon size={24} />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            +2.5%
          </span>
          <span className="text-xs text-gray-400 font-medium">
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}