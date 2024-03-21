import { distroToDocsRequirementsYaml } from "./distro-to-requirements-yaml.ts";

export async function cli(args: string[]) {
  // Parse the command line arguments
  if (args.length !== 1) {
    console.error("Usage: <distro>");
    Deno.exit(1);
  }
  const distro = args[0];

  // Get the requirements yaml string
  const result = await distroToDocsRequirementsYaml(distro);
  if (result.isErr()) {
    const error = result.unwrapErr();
    console.error(error.message);
    console.error("Make sure you choose a valid ROS 2 distro");
    Deno.exit(1);
  }
  const requirementsYaml = result.unwrap();

  // Write the requirements to a file
  const datetimeString = new Date().toISOString().replace(/:/g, "-");
  const filename = `requirements-v1-${distro}-${datetimeString}.yaml`;
  Deno.writeTextFileSync(filename, requirementsYaml);
  console.log(`Wrote requirements to ${filename}`);
}

if (import.meta.main) {
  await cli(Deno.args);
}
