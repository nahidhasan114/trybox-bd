import { paymentMethodLabels } from "@/lib/order-status";

type TelegramOrderDetails = {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  address: string;
  district: string;
  division: string;
  paymentMethod: string;
  totalAmount: number;
  items: { product_name: string; variant_name: string | null; quantity: number }[];
};

export async function notifyNewOrderOnTelegram(order: TelegramOrderDetails) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const itemsText = order.items
    .map((i) => `• ${i.product_name}${i.variant_name ? ` (${i.variant_name})` : ""} × ${i.quantity}`)
    .join("\n");

  const text = [
    "🛒 নতুন অর্ডার এসেছে!",
    "",
    `অর্ডার নম্বর: ${order.orderNumber}`,
    `নাম: ${order.customerName}`,
    `ফোন: ${order.customerPhone}`,
    `ঠিকানা: ${order.address}, ${order.district}, ${order.division}`,
    `পেমেন্ট: ${paymentMethodLabels[order.paymentMethod] ?? order.paymentMethod}`,
    `মোট: ৳${order.totalAmount}`,
    "",
    "প্রোডাক্ট:",
    itemsText || "—",
  ].join("\n");

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
  } catch (e) {
    console.error("Telegram order notification failed:", e);
  }
}
