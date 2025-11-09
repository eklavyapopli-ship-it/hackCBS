import Card, { CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export default function FundingStatus() {
  const applications = [
    { id: 1, name: 'AI-based Crop Health System', status: 'Under Review' },
    { id: 2, name: 'Carbon Credit Marketplace', status: 'Approved' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-semibold mb-6">Funding Status</h1>
      <div className="grid gap-6 max-w-3xl">
        {applications.map((app) => (
          <Card key={app.id}>
            <CardHeader>
              <CardTitle>{app.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Status:{' '}
                <span className={`font-medium ${app.status === 'Approved' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {app.status}
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
