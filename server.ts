const server = Bun.serve({
  port: 3000,

  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    const userAgent = req.headers.get("user-agent") || "";
    const accept = req.headers.get("accept") || "";

    const isCurl = userAgent.includes("curl");
    const wantsHTML = accept.includes("text/html");

    if (pathname.startsWith("/assets/")) {
      const file = Bun.file(`.${pathname}`);

      if (!(await file.exists())) {
        return new Response("Not Found", { status: 404 });
      }

      const type = pathname.split(".").pop();
      const contentTypes: Record<string, string> = {
        css: "text/css",
        js: "application/javascript",
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        svg: "image/svg+xml",
        ico: "image/x-icon",
      };

      return new Response(file, {
        headers: {
          "Content-Type": contentTypes[type || ""] || "application/octet-stream",
        },
      });
    }

    if (isCurl || !wantsHTML) {
      if (pathname === "/api/projects") {
        const data = await Bun.file("./assets/data.json").json();
        const projects = data.projects || [];
        const output = projects
          .map(
            (p: any) => `
            - ${p.name} 
                ${p.description}
                ${p.url}`,
          )
          .join("\n\n");
        return new Response(
          `
felipe@dev:~$ ls projects
${output}
`,
          {
            headers: { "Content-Type": "text/plain" },
          },
        );
      }

      if (pathname === "/api/skills") {
        const data = await Bun.file("./assets/data.json").json();
        const projects = data.skills || [];
        const output = projects.map((s: any) => `- ${s.name}`).join("\n\n");

        return new Response(
          `felipe@dev:~$ cat skills
          ${output}`,
          {
            headers: { "Content-Type": "text/plain" },
          },
        );
      }

      return new Response(
        `
╔══════════════════════════╗
   Felipe Gutierrez
   DevOps Engineer
╚══════════════════════════╝

Commands:
- /api/projects
- /api/skills

Example:
curl http://localhost:3000/projects
`,
        {
          headers: { "Content-Type": "text/plain" },
        },
      );
    }

    const indexFile = Bun.file("./index.html");

    if (!(await indexFile.exists())) {
      return new Response("index.html not found", { status: 500 });
    }

    return new Response(indexFile, {
      headers: { "Content-Type": "text/html" },
    });
  },
});

console.log(`🚀 Server running on http://localhost:${server.port}`);
