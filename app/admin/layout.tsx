import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="pl-64 lg:pl-64">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
