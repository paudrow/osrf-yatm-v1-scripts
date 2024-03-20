import { cli } from "./main.ts";

Deno.test("cli", async () => {
  const tempDir = Deno.makeTempDirSync();
  Deno.chdir(tempDir);
  const args = ["rolling"];
  await cli(args);
});
