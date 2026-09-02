import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { ProjectForm } from "@/components/admin/project-form";
import {
  getProject,
  updateProject,
  getActiveServices,
  getActiveCustomers,
} from "../../actions";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;

  let project;
  try {
    project = await getProject(id);
  } catch {
    notFound();
  }

  const [services, customers] = await Promise.all([
    getActiveServices(),
    getActiveCustomers(),
  ]);

  async function handleUpdate(data: Parameters<typeof updateProject>[1]) {
    "use server";
    await updateProject(id, data);
  }

  return (
    <DashboardShell
      title="Edit Project"
      description={`Editing ${project.name}`}
    >
      <ProjectForm
        project={project}
        customers={customers}
        services={services}
        onSubmit={handleUpdate}
      />
    </DashboardShell>
  );
}
