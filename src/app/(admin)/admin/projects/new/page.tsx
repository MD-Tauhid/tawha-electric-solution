import { DashboardShell } from "@/components/admin/dashboard-shell";
import { ProjectForm } from "@/components/admin/project-form";
import { createProject, getActiveServices, getActiveCustomers } from "../actions";

export default async function NewProjectPage() {
  const [services, customers] = await Promise.all([
    getActiveServices(),
    getActiveCustomers(),
  ]);

  return (
    <DashboardShell
      title="Create Project"
      description="Add a new project to your portfolio"
    >
      <ProjectForm
        customers={customers}
        services={services}
        onSubmit={createProject}
      />
    </DashboardShell>
  );
}
