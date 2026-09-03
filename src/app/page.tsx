import type { Metadata } from "next";
import {
  getPublicCompanySettings,
  getPublicServices,
  getFeaturedServices,
  getPublicProjects,
} from "@/lib/public-data";
import { Navbar } from "@/components/public/navbar";
import { HeroSection } from "@/components/public/hero-section";
import { AboutSection } from "@/components/public/about-section";
import { ServicesSection } from "@/components/public/services-section";
import { WhyChooseUs } from "@/components/public/why-choose-us";
import { ClientsSection } from "@/components/public/clients-section";
import { PortfolioSection } from "@/components/public/portfolio-section";
import { CtaSection } from "@/components/public/cta-section";
import { ContactSection } from "@/components/public/contact-section";
import { Footer } from "@/components/public/footer";

export const metadata: Metadata = {
  title:
    "Tawha Electrical Solution — Professional Electrical Services in Bangladesh",
  description:
    "Expert electrical engineering and services for residential, commercial, and industrial needs. Electrical planning, wiring, circuit design, lighting, installation, and maintenance by licensed engineers.",
  keywords: [
    "electrical services Bangladesh",
    "electrical engineering",
    "wiring installation",
    "circuit planning",
    "lighting design",
    "electrical maintenance",
    "residential electrical",
    "commercial electrical",
    "industrial electrical",
    "restaurant electrical",
    "electrical safety inspection",
    "emergency electrical service",
  ],
  openGraph: {
    title:
      "Tawha Electrical Solution — Professional Electrical Services",
    description:
      "Expert electrical engineering and services. Planning, wiring, installation, maintenance for residential, commercial, and industrial spaces.",
    type: "website",
    locale: "en_US",
  },
};

export default async function HomePage() {
  const [settings, services, featuredServices, projects] = await Promise.all([
    getPublicCompanySettings(),
    getPublicServices(),
    getFeaturedServices(),
    getPublicProjects(),
  ]);

  return (
    <div className="public-section">
      <Navbar companyName={settings.companyName} phone={settings.phone} />
      <main>
        <HeroSection phone={settings.phone} />
        <AboutSection />
        <ServicesSection
          services={services}
          featuredServices={featuredServices}
        />
        <WhyChooseUs />
        <ClientsSection />
        <PortfolioSection projects={projects} />
        <CtaSection phone={settings.phone} />
        <ContactSection settings={settings} />
      </main>
      <Footer settings={settings} />
    </div>
  );
}
