import { distroToDocsRequirementsYaml } from "./distro-to-requirements-yaml.ts";
import { assert } from "jsr:@std/assert";

Deno.test("returns result for valid distro", async () => {
  const result = await distroToDocsRequirementsYaml("rolling");
  assert(result.isOk());
});

Deno.test("returns error for invalid distro", async () => {
  const result = await distroToDocsRequirementsYaml("invalid");
  assert(result.isErr());
});
