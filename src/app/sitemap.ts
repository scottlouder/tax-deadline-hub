import { MetadataRoute } from "next";
import { entityTypes, states } from "../lib/data";
import { getAllTaxChangeSlugs } from "../lib/tax-changes";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://taxdeadlinehub.com";
  const staticRoutes = ["", "/calculators", "/estimated-payments"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const stateRoutes = states.map((state) => ({
    url: `${baseUrl}/state/${state.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const entityRoutes = entityTypes.map((entity) => ({
    url: `${baseUrl}/entity/${entity.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const comboRoutes = states.flatMap((state) =>
    entityTypes.map((entity) => ({
      url: `${baseUrl}/state/${state.slug}/${entity.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  );

  const estimatedPaymentRoutes = states.map((state) => ({
    url: `${baseUrl}/state/${state.slug}/estimated-payments`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const blogRoutes = [
    "2026-federal-tax-deadlines",
    "estimated-tax-payments-guide",
    "state-tax-filing-deadlines-2026",
    "c-corp-tax-deadlines-2026",
    "utah-estimated-tax-payments",
    "florida-business-tax-guide",
    "iowa-tax-deadlines-2026",
    "massachusetts-tax-deadlines-2026",
  ].map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const changesHubRoute = [{
    url: `${baseUrl}/changes`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }];

  const changesRoutes = getAllTaxChangeSlugs().map((slug) => ({
    url: `${baseUrl}/changes/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...changesHubRoute, ...changesRoutes, ...stateRoutes, ...entityRoutes, ...comboRoutes, ...estimatedPaymentRoutes, ...blogRoutes];
}
