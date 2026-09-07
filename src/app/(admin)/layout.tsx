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
    <div className="admin-workspace lg:flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:inset-y-0 lg:z-50 lg:flex lg:w-52">
        <Sidebar className="w-full" />
      </div>

      {/* Main Content Area */}
      <div className="grow flex flex-col relative">
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
