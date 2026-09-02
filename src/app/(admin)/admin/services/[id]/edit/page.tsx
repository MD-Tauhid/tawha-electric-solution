import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { ServiceForm } from "@/components/admin/service-form";
import { getService, updateService } from "../../actions";

interface EditServicePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params;

  let service;
  try {
    service = await getService(id);
  } catch {
    notFound();
  }

  async function handleUpdate(data: Parameters<typeof updateService>[1]) {
    "use server";
    await updateService(id, data);
  }

  return (
    <DashboardShell
      title="Edit Service"
      description={`Editing ${service.name}`}
    >
      <div className="max-w-2xl">
        <ServiceForm service={service} onSubmit={handleUpdate} />
      </div>
    </DashboardShell>
  );
}
