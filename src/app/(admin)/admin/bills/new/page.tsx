import { DashboardShell } from "@/components/admin/dashboard-shell";
import { getProjectsForBillSelect } from "../actions";
import { NewBillForm } from "./new-bill-form";

export default async function NewBillPage() {
  const projects = await getProjectsForBillSelect();

  return (
    <DashboardShell
      title="Create Bill"
      description="Generate a bill for a project"
    >
      <NewBillForm projects={projects} />
    </DashboardShell>
  );
}
