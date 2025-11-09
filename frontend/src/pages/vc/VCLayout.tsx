import VCSidebar from '../../components/ui/Sidebar';

export default function VCLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex">
      <VCSidebar />
      <main className="flex-1 px-6 py-6">{children}</main>
    </div>
  );
}
