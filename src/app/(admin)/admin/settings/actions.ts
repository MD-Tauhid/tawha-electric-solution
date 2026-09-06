"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import {
  DEFAULT_COMPANY_SETTINGS,
  toCompanySettingsData,
  type CompanySettingsData,
} from "@/lib/company-settings";
import {
  companySettingsSchema,
  type CompanySettingsFormData,
} from "@/lib/validations/settings";

/**
 * Get the current company settings for the admin settings page.
 * Falls back to defaults when no record exists yet.
 */
export async function getCompanySettings(): Promise<CompanySettingsData> {
  await requireAdmin();

  const settings = await prisma.companySettings.findFirst();
  if (!settings) return DEFAULT_COMPANY_SETTINGS;
  return toCompanySettingsData(settings);
}

/**
 * Create or update company settings.
 * A single settings record is used; the first save creates it, later saves update it.
 */
export async function updateCompanySettings(data: CompanySettingsFormData) {
  await requireAdmin();

  const validated = companySettingsSchema.parse(data);

  const dataToSave = {
    companyName: validated.companyName,
    phone: validated.phone || null,
    email: validated.email || null,
    address: validated.address || null,
    whatsapp: validated.whatsapp || null,
    facebook: validated.facebook || null,
    instagram: validated.instagram || null,
    googleMapsUrl: validated.googleMapsUrl || null,
    businessHours: validated.businessHours || null,
  };

  const existing = await prisma.companySettings.findFirst();

  if (existing) {
    await prisma.companySettings.update({
      where: { id: existing.id },
      data: dataToSave,
    });
  } else {
    await prisma.companySettings.create({
      data: dataToSave,
    });
  }

  // Reflect updated information on the public website immediately.
  revalidatePath("/");
  revalidatePath("/admin/settings");
}