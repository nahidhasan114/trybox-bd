import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  let sendResult: unknown = null;
  let sendError: string | null = null;
  if (token && chatId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: "🔧 Debug endpoint test message" }),
      });
      sendResult = { status: res.status, body: await res.text() };
    } catch (e) {
      sendError = e instanceof Error ? e.message : String(e);
    }
  }

  return NextResponse.json({
    hasToken: !!token,
    tokenLength: token?.length ?? 0,
    tokenPreview: token ? `${token.slice(0, 8)}...${token.slice(-4)}` : null,
    hasChatId: !!chatId,
    chatIdValue: chatId ?? null,
    sendResult,
    sendError,
  });
}
