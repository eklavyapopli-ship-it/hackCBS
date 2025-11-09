type Slice = { name: string; value: number; color: string };

const data: Slice[] = [
  { name: 'Tech', value: 45, color: '#3b82f6' },
  { name: 'Healthcare', value: 25, color: '#10b981' },
  { name: 'FinTech', value: 20, color: '#f59e0b' },
  { name: 'Others', value: 10, color: '#ef4444' },
];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

export default function FundDistributionChart() {
  const total = data.reduce((s, d) => s + d.value, 0);
  let angle = 0;
  const cx = 150;
  const cy = 150;
  const r = 120;

  return (
    <div className="w-full flex items-center justify-center">
      <svg width={320} height={320} viewBox="0 0 300 300">
        {data.map((d, i) => {
          const start = angle;
          const sliceAngle = (d.value / total) * 360;
          angle += sliceAngle;
          const path = describeArc(cx, cy, r, start, start + sliceAngle);
          return <path key={i} d={path} fill={d.color} stroke="#fff" strokeWidth={1} />;
        })}
      </svg>
    </div>
  );
}
