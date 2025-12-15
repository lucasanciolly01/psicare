import {
  type LucideIcon,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  description?: string;
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
  trendLabel,
}: StatCardProps) {
  // Design 3.0: Mapeamento mais sutil e profissional
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-primary-50 text-primary-600 border-primary-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
  };

  const activeStyle = colorMap[color] || colorMap.blue;

  let trendColor = "bg-secondary-100 text-secondary-600";
  let TrendIcon = Minus;

  if (trendValue !== undefined) {
    if (trendValue > 0) {
      trendColor = "bg-emerald-100 text-emerald-700";
      TrendIcon = ArrowUpRight;
    } else if (trendValue < 0) {
      trendColor = "bg-rose-100 text-rose-700";
      TrendIcon = ArrowDownRight;
    }
  }

  return (
    <div className="bg-surface p-6 rounded-2xl shadow-card hover:shadow-card-hover border border-secondary-100/50 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-3 rounded-xl border ${activeStyle} transition-transform group-hover:scale-110 duration-300`}
        >
          <Icon size={22} strokeWidth={2.5} />
        </div>

        {trendValue !== undefined && (
          <span
            className={`text-[11px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${trendColor}`}
          >
            <TrendIcon size={10} strokeWidth={3} />
            {Math.abs(trendValue)}%
          </span>
        )}
      </div>

      <div>
        <h3 className="text-3xl font-bold text-secondary-900 tracking-tight mb-1">
          {value}
        </h3>
        <p className="text-sm font-medium text-secondary-500">{title}</p>

        <p className="text-xs text-secondary-400 mt-3 font-medium">
          {trendLabel || description}
        </p>
      </div>
    </div>
  );
}
