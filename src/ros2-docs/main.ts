import Sitemapper from "npm:sitemapper";
import type { Page } from "./types.ts";
import type { Requirement, Requirements } from "../common/types.ts";
import { saveRequirementsToFile } from "../common/save-requirements-file.ts";

export async function cli(args: string[]) {
  // Parse the command line arguments
  if (args.length !== 1) {
    console.error("Usage: <distro>");
    Deno.exit(1);
  }
  const distro = args[0];

  // Make requirements from the sitemap
  const sitemapUrl = new URL(`https://docs.ros.org/en/${distro}/sitemap.xml`);
  const pages = await sitemapUrlToPages(sitemapUrl, ["en", distro]);
  const requirements: Requirements = {
    requirements: pagesToRequirements(pages, ["docs"]),
  };

  // Save the requirements to a file
  saveRequirementsToFile(requirements);
}

function pagesToRequirements(
  pages: Page[],
  additionalLabels: string[] = [],
): Requirement[] {
  return pages.map((page) => (
    {
      name: page.name,
      labels: [...page.labels, ...additionalLabels],
      description: `Check the documentation for the '${page.name}' page`,
      links: [
        {
          name: `${page.name} page`,
          url: page.url,
        },
      ],
      checks: [
        {
          name: "I was able to follow the documentation.",
        },
        {
          name: "The documentation seemed clear to me.",
        },
        {
          name: "The documentation didn't have any obvious errors.",
        },
      ],
    }
  ));
}

async function sitemapUrlToPages(url: URL, urlPartsToIgnore: string[]) {
  const sites = await getSitemapSites(url);
  return sites.map((site) => urlToPage(site, urlPartsToIgnore));
}

function urlToPage(url: URL, urlPartsToIgnore: string[]): Page {
  const parts = url.pathname
    .split("/").map((part) => part.trim().replaceAll("-", " "));

  const pageTitle = parts.pop()?.split(".")[0] || url.pathname;
  const labels = parts.filter((part) => (
    part !== "" &&
    !urlPartsToIgnore.includes(part)
  )).map((part) => part.toLowerCase());

  return {
    labels,
    name: pageTitle,
    url: url.href,
  };
}

async function getSitemapSites(url: URL): Promise<URL[]> {
  // @ts-expect-error - The type definitions for sitemapper are incorrect
  const sitemap = new Sitemapper();
  const { sites } = await sitemap.fetch(url);
  return sites.map((site: string) => new URL(site));
}

if (import.meta.main) {
  await cli(Deno.args);
}
