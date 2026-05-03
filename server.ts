const buildClient = async () => {
  const result = await Bun.build({
    entrypoints: ["./index.ts"],
    outdir: "./assets",
    naming: "index.js",
  });

  if (!result.success) {
    console.error("Build fallido:", result.logs);
  } else {
    console.log("Assets listos (index.ts -> assets/client.js)");
  }
};

await buildClient();

const CONTENT_TYPES: Record<string, string> = {
  css: "text/css",
  js: "application/javascript",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  json: "application/json",
};

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

    const textResponse = (body: any) =>
      new Response(body, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });

    if (
      pathname.startsWith("/assets/") ||
      pathname.startsWith("/public/") ||
      pathname === "/lang.json"
    ) {
      const localPath = `./assets/${pathname.split("/").pop()}`;
      const distPath = `./dist/assets/${pathname.split("/").pop()}`;

      const file = (await Bun.file(distPath).exists()) ? Bun.file(distPath) : Bun.file(localPath);

      if (!(await file.exists())) {
        return new Response("Not Found", { status: 404 });
      }

      const ext = pathname.split(".").pop() || "";
      const contentType = CONTENT_TYPES[ext] || "application/octet-stream";

      return new Response(file, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000",
        },
      });
    }

    if (isCurl || !wantsHTML) {
      let data: any = { projects: [], skills: [] };
      if (pathname === "/projects" || pathname === "/skills") {
        try {
          data = await Bun.file("/data.json").json();
        } catch (e) {
          return textResponse(`${log("Error: data.json not found or invalid")}\n`);
        }
      }

      const formatProjects = (projects: any) =>
        projects.map((p: any) => `\n▶ ${p.name}\n${p.description}\n→ ${p.url}`).join("\n");

      const formatSkills = (skills: any) => skills.map((s: any) => `• ${s.name}`).join("\n");

      if (pathname === "/") {
        return textResponse(`
╔══════════════════════════════════╗
    Felipe Gutierrez | DevOps
╚══════════════════════════════════╝

${log("Terminal interface ready")}

Available commands:
curl /projects    → List projects
curl /skills      → List skills
curl /whoami      → About me
curl /help        → Show help
`);
      }

      if (pathname === "/projects") {
        return textResponse(
          `felipe@dev:~$ curl /projects\n${log("Fetching projects...")}\n${formatProjects(data.projects)}\n`,
        );
      }

      if (pathname === "/skills") {
        return textResponse(
          `felipe@dev:~$ cat skills\n${log("Loading skills...")}\n${formatSkills(data.skills)}\n`,
        );
      }

      if (pathname === "/whoami") {
        return textResponse(
          `felipe@dev:~$ whoami\n\nFelipe Gutierrez\nDevOps Engineer\n\n* Infraestructura como código\n* Automatización\n* CI/CD\n* Cloud (AWS)\n\n${log("Profile loaded")}\n`,
        );
      }

      if (pathname === "/help") {
        return textResponse(
          `felipe@dev:~$ help\n\n/projects  → Lista de proyectos\n/skills    → Tecnologías\n/whoami    → Perfil profesional\n/help      → Esta ayuda\n`,
        );
      }

      return textResponse(`Command not found: ${pathname}\nTry: curl /help\n`);
    }

    const indexFile = Bun.file("./index.html");

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

    const html = rawHtml.replace("{{LAST_LOGIN}}", `${lastLogin} from recruiter.dev`);

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  },
});

console.log(`🚀 Server running on http://localhost:${server.port}`);
