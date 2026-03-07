import { MetadataRoute } from "next";
import { entityTypes, states } from "../lib/data";

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

  return [...staticRoutes, ...stateRoutes, ...entityRoutes, ...comboRoutes, ...estimatedPaymentRoutes];
}
