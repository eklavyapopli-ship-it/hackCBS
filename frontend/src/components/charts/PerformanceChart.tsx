const data = [
  { month: 'Jan', value: 400 },
  { month: 'Feb', value: 700 },
  { month: 'Mar', value: 1000 },
  { month: 'Apr', value: 1200 },
];

export default function PerformanceChart() {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="w-full">
      <div className="flex items-end gap-3 h-48">
        {data.map((d) => (
          <div key={d.month} className="flex-1 flex flex-col items-center">
            <div className="w-full bg-blue-500 rounded-t" style={{ height: `${(d.value / max) * 100}%` }} />
            <div className="text-xs mt-2">{d.month}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
