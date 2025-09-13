// /functions/sendMessage.js
export async function onRequestPost(context) {
  try {
    const botToken = context.env.telegram_bot_id; // Cloudflare secret
    if (!botToken) {
      return new Response(JSON.stringify({ error: "Bot token not found" }), { status: 500 });
    }

    const body = await context.request.json();

    // Basic validation: require chat_id and text
    if (!body?.chat_id || !body?.text) {
      return new Response(JSON.stringify({ error: "Missing chat_id or text" }), { status: 400 });
    }

    const resp = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: body.chat_id,
        text: body.text,
        parse_mode: "HTML"
      }),
    });

    const respText = await resp.text();
    return new Response(respText, { status: resp.status, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
