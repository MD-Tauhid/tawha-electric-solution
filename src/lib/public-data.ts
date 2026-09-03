import { prisma } from "@/lib/prisma";

/**
 * Default company settings used when no CompanySettings record exists.
 */
const DEFAULT_COMPANY_SETTINGS = {
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

export type PublicCompanySettings = typeof DEFAULT_COMPANY_SETTINGS;

/**
 * Get company settings for the public site.
 * Falls back to defaults if no settings exist in the database.
 */
export async function getPublicCompanySettings(): Promise<PublicCompanySettings> {
  try {
    const settings = await prisma.companySettings.findFirst();
    if (!settings) return DEFAULT_COMPANY_SETTINGS;

    return {
      companyName: settings.companyName || DEFAULT_COMPANY_SETTINGS.companyName,
      phone: settings.phone || DEFAULT_COMPANY_SETTINGS.phone,
      email: settings.email || DEFAULT_COMPANY_SETTINGS.email,
      address: settings.address || DEFAULT_COMPANY_SETTINGS.address,
      whatsapp: settings.whatsapp || "",
      facebook: settings.facebook || "",
      instagram: settings.instagram || "",
      googleMapsUrl: settings.googleMapsUrl || "",
      businessHours: settings.businessHours || DEFAULT_COMPANY_SETTINGS.businessHours,
    };
  } catch {
    return DEFAULT_COMPANY_SETTINGS;
  }
}

/**
 * Get all active services for the public services grid.
 */
export async function getPublicServices() {
  try {
    return prisma.service.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        description: true,
        rate: true,
        unit: true,
        isFeatured: true,
      },
      orderBy: { name: "asc" },
    });
  } catch {
    return [];
  }
}

/**
 * Get featured active services for the spotlight section.
 */
export async function getFeaturedServices() {
  try {
    return prisma.service.findMany({
      where: { isActive: true, isFeatured: true },
      select: {
        id: true,
        name: true,
        description: true,
        rate: true,
        unit: true,
      },
      orderBy: { name: "asc" },
    });
  } catch {
    return [];
  }
}

/**
 * Get completed and ongoing projects for the portfolio showcase.
 */
export async function getPublicProjects() {
  try {
    return prisma.project.findMany({
      where: {
        status: { in: ["COMPLETED", "ONGOING"] },
      },
      select: {
        id: true,
        name: true,
        description: true,
        location: true,
        status: true,
        totalValue: true,
        startDate: true,
        actualEndDate: true,
        customer: {
          select: {
            name: true,
            type: true,
          },
        },
        items: {
          select: {
            service: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 12,
    });
  } catch {
    return [];
  }
}
