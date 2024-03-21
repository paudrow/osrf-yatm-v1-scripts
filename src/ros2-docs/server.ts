import { distroToDocsRequirementsYaml } from "./distro-to-requirements-yaml.ts";

import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";

const router = new Router();
router.get("/", (ctx) => {
  ctx.response.body = `<!DOCTYPE html>
    <html>
      <head><title>ROS 2 docs for YATM</title><head>
      <body>
        <h1>ROS 2 docs for YATM</h1>
        <p>Use the /:distro endpoint to get the requirements for a ROS 2 distro</p>
        <p>For example: <a href="/rolling">/rolling</a></p>
      </body>
    </html>
  `;
});

router.get("/:distro", async (ctx) => {
  const distro = ctx.params.distro;

  const result = await distroToDocsRequirementsYaml(distro);
  if (result.isErr()) {
    ctx.response.status = 404;
    ctx.response.body = `distro ${distro} not found`;
    return;
  }

  const requirementsYaml = result.unwrap();
  ctx.response.body = requirementsYaml;
  ctx.response.headers.set("Content-Type", "text/yaml");
  ctx.response.status = 200;
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8080 });
