import { type LucideIcon, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  // 'description' substitui o antigo 'trend' para textos simples
  description?: string;
  // Novos campos opcionais para cálculo automático de tendência
  trendValue?: number;
  trendLabel?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color,
  description,
  trendValue,
  trendLabel
}: StatCardProps) {
  
  // Mapeamento de cores
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 ring-blue-100',
    green: 'bg-green-50 text-green-600 ring-green-100',
    purple: 'bg-purple-50 text-purple-600 ring-purple-100',
    orange: 'bg-orange-50 text-orange-600 ring-orange-100',
  };

  const activeColor = colorMap[color] || colorMap.blue;

  // Lógica de Tendência: Define cor e ícone baseados no número positivo ou negativo
  let trendColor = 'bg-gray-100 text-gray-600';
  let TrendIcon = Minus;

  if (trendValue !== undefined) {
      if (trendValue > 0) {
          trendColor = 'bg-green-100 text-green-700';
          TrendIcon = ArrowUpRight;
      } else if (trendValue < 0) {
          trendColor = 'bg-red-100 text-red-700';
          TrendIcon = ArrowDownRight;
      }
  }

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
      
      <div className="mt-4 flex items-center gap-2">
        {/* Se houver um valor percentual, exibe a pílula colorida */}
        {trendValue !== undefined && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${trendColor}`}>
              <TrendIcon size={12} />
              {Math.abs(trendValue)}%
            </span>
        )}
        
        {/* Exibe o texto descritivo (ou o label da tendência) */}
        <span className="text-xs text-gray-400 font-medium">
          {trendLabel || description}
        </span>
      </div>
    </div>
  );
}