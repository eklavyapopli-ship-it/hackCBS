import Card, { CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const data = [
  { month: 'Jan', investment: 20000 },
  { month: 'Feb', investment: 40000 },
  { month: 'Mar', investment: 30000 },
  { month: 'Apr', investment: 50000 },
];

function SimpleBarChart({ data }: { data: { month: string; investment: number }[] }) {
  const max = Math.max(...data.map((d) => d.investment));
  return (
    <div className="flex items-end gap-4 h-52">
      {data.map((d) => (
        <div key={d.month} className="flex flex-col items-center">
          <div className="w-10 bg-indigo-600 rounded-t" style={{ height: `${(d.investment / max) * 100}%` }} />
          <div className="text-xs mt-2">{d.month}</div>
        </div>
      ))}
    </div>
  );
}

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-semibold mb-6">Reports & Analytics</h1>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Monthly Investment Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleBarChart data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
