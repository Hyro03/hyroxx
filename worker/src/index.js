export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };
    if (request.method === "OPTIONS") return new Response("", { headers: cors });

    if (url.pathname === "/api/links") {
      if (request.method === "POST") {
        const body = await request.json();
        if (body.password !== "hyroxx123") {
          return new Response(JSON.stringify({ error: "password salah" }), { status: 401, headers: cors });
        }
        await env.LINKS.put("config", JSON.stringify({
          wa: body.wa,
          group: body.group,
          telegram: body.telegram
        }));
        return new Response(JSON.stringify({ ok: true }), { headers: cors });
      } else {
        let data = await env.LINKS.get("config", "json");
        if (!data) {
          data = {
            wa: "https://wa.me/6281234567890",
            group: "https://chat.whatsapp.com/xxxx",
            telegram: "https://t.me/hyroxx"
          };
        }
        return new Response(JSON.stringify(data), { headers: { ...cors, "Content-Type": "application/json" } });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
