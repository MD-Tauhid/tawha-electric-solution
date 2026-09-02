import { requireAuth } from "@/lib/auth-utils";
import { Sidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="lg:pl-72">
        <AdminHeader
          user={{
            name: session.user.name,
            email: session.user.email,
            role: session.user.role,
          }}
        />
        <main>{children}</main>
      </div>
    </div>
  );
}
