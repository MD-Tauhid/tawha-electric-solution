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

      <div className="mt-8 max-w-2xl rounded-xl border border-border/60 bg-card p-6">
        <h2 className="text-base font-semibold text-card-foreground mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>
          About this section
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          These details are displayed on the public website (contact section,
          footer, and navigation). Changes take effect immediately after saving.
        </p>
      </div>
    </DashboardShell>
  );
}
