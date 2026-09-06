/**
 * Default company settings used when no CompanySettings record exists.
 * Single source of truth shared by the public site and the admin settings page.
 */
export const DEFAULT_COMPANY_SETTINGS = {
  companyName: "Tawha Electrical Solution",
  phone: "+880 1XXX-XXXXXX",
  email: "info@tawhaelectrical.com",
  address: "Dhaka, Bangladesh",
  whatsapp: "",
  facebook: "",
  instagram: "",
  googleMapsUrl: "",
  businessHours: "Sat–Thu: 9:00 AM – 6:00 PM",
};

export type CompanySettingsData = typeof DEFAULT_COMPANY_SETTINGS;

/**
 * Map a database CompanySettings record to the shape used across the app,
 * falling back to defaults for any empty value.
 */
export function toCompanySettingsData(settings: {
  companyName: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  whatsapp: string | null;
  facebook: string | null;
  instagram: string | null;
  googleMapsUrl: string | null;
  businessHours: string | null;
}): CompanySettingsData {
  return {
    companyName: settings.companyName || DEFAULT_COMPANY_SETTINGS.companyName,
    phone: settings.phone || DEFAULT_COMPANY_SETTINGS.phone,
    email: settings.email || DEFAULT_COMPANY_SETTINGS.email,
    address: settings.address || DEFAULT_COMPANY_SETTINGS.address,
    whatsapp: settings.whatsapp || "",
    facebook: settings.facebook || "",
    instagram: settings.instagram || "",
    googleMapsUrl: settings.googleMapsUrl || "",
    businessHours:
      settings.businessHours || DEFAULT_COMPANY_SETTINGS.businessHours,
  };
}