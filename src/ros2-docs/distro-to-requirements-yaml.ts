import Sitemapper from "npm:sitemapper";
import type { Page } from "./types.ts";
import type { Requirement, Requirements } from "../common/types.ts";
import { stringify } from "jsr:@std/yaml";
import { Err, Ok, Result } from "jsr:@oxi/result";

export async function distroToDocsRequirementsYaml(
  distro: string,
): Promise<Result<string, Error>> {
  // Make requirements from the sitemap
  const sitemapUrl = new URL(`https://docs.ros.org/en/${distro}/sitemap.xml`);
  const result = await sitemapUrlToPages(sitemapUrl, ["en", distro]);
  if (result.isErr()) {
    return Err(result.unwrapErr());
  }
  const pages = result.unwrap();
  const requirements: Requirements = {
    requirements: pagesToRequirements(pages, ["docs"]),
  };

  return Ok(stringify(requirements));
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

async function sitemapUrlToPages(
  url: URL,
  urlPartsToIgnore: string[],
): Promise<Result<Page[], Error>> {
  const result = await getSitemapSites(url);
  if (result.isErr()) {
    return Err(result.unwrapErr());
  }
  const sites = result.unwrap();
  return Ok(sites.map((site) => urlToPage(site, urlPartsToIgnore)));
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

async function getSitemapSites(url: URL): Promise<Result<URL[], Error>> {
  // @ts-expect-error - The type definitions for sitemapper are incorrect
  const sitemap = new Sitemapper();
  const { sites, errors } = await sitemap.fetch(url);

  if (errors.length > 0) {
    return Err(errors[0]);
  }
  return Ok(sites.map((site: string) => new URL(site)));
}

await distroToDocsRequirementsYaml("rolln");
