const server = Bun.serve({
  port: 3000,

  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    const userAgent = req.headers.get("user-agent") || "";
    const accept = req.headers.get("accept") || "";

    const isCurl = userAgent.includes("curl");
    const wantsHTML = accept.includes("text/html");

    const now = () => new Date().toISOString().replace("T", " ").split(".")[0];

    const log = (msg: any) => `[${now()}] INFO ${msg}`;

    const formatProjects = (projects: any) =>
      projects
        .map(
          (p: any) => `
▶ ${p.name}
${p.description}
→ ${p.url}`,
        )
        .join("\n");

    const formatSkills = (skills: any) => skills.map((s: any) => `• ${s.name}`).join("\n");

    const textResponse = (body: any) =>
      new Response(body, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });

    if (pathname.startsWith("/assets/")) {
      const file = Bun.file(`.${pathname}`);

      if (!(await file.exists())) {
        return new Response("Not Found", { status: 404 });
      }

      const type = pathname.split(".").pop();

      const contentTypes = {
        css: "text/css",
        js: "application/javascript",
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        svg: "image/svg+xml",
        ico: "image/x-icon",
        json: "application/json",
      };

      return new Response(file, {
        headers: {
          "Content-Type": contentTypes[type || ""] || "application/octet-stream",
          "Cache-Control": "public, max-age=31536000",
        },
      });
    }

    if (isCurl || !wantsHTML) {
      // ROOT
      if (pathname === "/") {
        return textResponse(`

╔══════════════════════════════════╗
    Felipe Gutierrez | DevOps
╚══════════════════════════════════╝

${log("Terminal interface ready")}

Available commands:

curl /projects   → List projects
curl /skills     → List skills
curl /whoami     → About me
curl /help       → Show help

Example:
curl http://localhost:3000/projects
`);
      }

      if (pathname === "/projects") {
        const data = await Bun.file("./assets/data.json").json();
        const projects = data.projects || [];

        return textResponse(`
felipe@dev:~$ curl /projects
${log("Fetching projects...")}
${formatProjects(projects)}
`);
      }

      if (pathname === "/skills") {
        const data = await Bun.file("./assets/data.json").json();
        const skills = data.skills || [];

        return textResponse(`
felipe@dev:~$ cat skills
${log("Loading skills...")}
${formatSkills(skills)}
`);
      }

      if (pathname === "/whoami") {
        return textResponse(`
felipe@dev:~$ whoami

Felipe Gutierrez
DevOps Engineer

* Infraestructura como código
* Automatización
* CI/CD
* Cloud (AWS)

${log("Profile loaded")}
`);
      }

      if (pathname === "/help") {
        return textResponse(`
felipe@dev:~$ help

Commands:

/projects   → Lista de proyectos
/skills     → Tecnologías
/whoami     → Perfil profesional
/help       → Esta ayuda
`);
      }

      return textResponse(`
Command not found: ${pathname}

Try:
curl /help
`);
    }

    const indexFile = Bun.file("./index.html");
    // const buildInfoFile = Bun.file("./assets/build-info.json");

    if (!(await indexFile.exists())) {
      return new Response("index.html not found", { status: 500 });
    }

    const rawHtml = await indexFile.text();

    const lastLogin = new Date().toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    let deploymentInfo = `${lastLogin} from recruiter.dev`;

    // if (await buildInfoFile.exists()) {
    //   const buildInfo = await buildInfoFile.json();
    //
    //   if (buildInfo?.lastDeployment) {
    //     deploymentInfo = buildInfo.lastDeployment;
    //   }
    // }

    const html = rawHtml.replace("{{LAST_LOGIN}}", deploymentInfo);

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  },
});

console.log(`🚀 Server running on http://localhost:${server.port}`);
