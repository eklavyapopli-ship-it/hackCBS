const data = [
  { name: 'Q1', ROI: 12 },
  { name: 'Q2', ROI: 18 },
  { name: 'Q3', ROI: 25 },
  { name: 'Q4', ROI: 30 },
];

export default function ROIChart() {
  const max = Math.max(...data.map((d) => d.ROI));

  return (
    <div className="w-full">
      <div className="flex items-end gap-4 h-48">
        {data.map((d) => (
          <div key={d.name} className="flex-1 flex flex-col items-center">
            <div className="w-10 bg-green-500 rounded-t" style={{ height: `${(d.ROI / max) * 100}%` }} />
            <div className="text-xs mt-2">{d.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
