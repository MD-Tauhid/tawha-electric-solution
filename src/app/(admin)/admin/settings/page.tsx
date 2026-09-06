import { Building2 } from "lucide-react";
import { DashboardShell } from "@/components/admin/dashboard-shell";
import { SettingsForm } from "@/components/admin/settings-form";
import { getCompanySettings, updateCompanySettings } from "./actions";

export default async function SettingsPage() {
  const settings = await getCompanySettings();

  return (
    <DashboardShell
      title="Company Settings"
      description="Manage company information shown on the public website"
    >
      <div className="max-w-2xl">
        <SettingsForm settings={settings} onSubmit={updateCompanySettings} />
      </div>

      <div className="mt-8 max-w-2xl rounded-lg border bg-white p-6">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-muted-foreground" />
          About this section
        </h2>
        <p className="text-sm text-muted-foreground">
          These details are displayed on the public website (contact section,
          footer, and navigation). Changes take effect immediately after saving.
        </p>
      </div>
    </DashboardShell>
  );
}