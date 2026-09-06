import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedAdminUser() {
  const email = "admin@tawhaelectrical.com";
  const password = "admin123"; // Change this in production
  const name = "Admin";

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`User with email ${email} already exists. Skipping user seed.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`Created admin user: ${user.email} (id: ${user.id})`);
}

async function seedCompanySettings() {
  const existingSettings = await prisma.companySettings.findFirst();

  if (existingSettings) {
    console.log("Company settings already exist. Skipping settings seed.");
    return;
  }

  const settings = await prisma.companySettings.create({
    data: {
      companyName: "Tawha Electrical Solution",
      phone: "+880 1XXX-XXXXXX",
      email: "info@tawhaelectrical.com",
      address: "Dhaka, Bangladesh",
      whatsapp: "",
      facebook: "",
      instagram: "",
      googleMapsUrl: "",
      businessHours: "Sat–Thu: 9:00 AM – 6:00 PM",
    },
  });

  console.log(`Created company settings (id: ${settings.id})`);
}

async function main() {
  await seedAdminUser();
  await seedCompanySettings();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });