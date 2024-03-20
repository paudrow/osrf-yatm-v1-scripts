import { stringify } from "@std/yaml";
import type { Requirements } from "./types.ts";

export function saveRequirementsToFile(requirements: Requirements) {
  const requirementsYaml = stringify(requirements);
  const datetimeString = new Date().toISOString().replace(/:/g, "-");
  const filename = `requirements-v1-${datetimeString}.yaml`;
  Deno.writeTextFileSync(filename, requirementsYaml);
  console.log(`Wrote requirements to ${filename}`);
}
