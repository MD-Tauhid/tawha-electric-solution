import { DashboardShell } from "@/components/admin/dashboard-shell";
import { ServiceForm } from "@/components/admin/service-form";
import { createService } from "../actions";

export default function NewServicePage() {
  return (
    <DashboardShell
      title="Create Service"
      description="Add a new service to your catalog"
    >
      <div className="max-w-2xl">
        <ServiceForm onSubmit={createService} />
      </div>
    </DashboardShell>
  );
}
