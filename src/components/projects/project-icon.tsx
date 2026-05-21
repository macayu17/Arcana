import {
  Activity,
  BrainCircuit,
  CalendarCheck,
  CandlestickChart,
  Gauge,
  Shield,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  shield: Shield,
  "brain-circuit": BrainCircuit,
  activity: Activity,
  "calendar-check": CalendarCheck,
  "candlestick-chart": CandlestickChart,
  gauge: Gauge,
};

export function ProjectIcon({ name }: { name: string }) {
  const Icon = icons[name] ?? Shield;

  return <Icon aria-hidden="true" size={20} strokeWidth={1.8} />;
}
