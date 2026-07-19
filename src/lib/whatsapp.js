import { WHATSAPP_NUMBER, PRODUCTS } from "./data.js";

export function generateWhatsAppUrl(cart) {
  if (!cart || cart.length === 0) return `https://wa.me/${WHATSAPP_NUMBER}`;

  const lines = cart.map((item) => {
    const p = PRODUCTS[item.productId];
    const variantLabel = item.variant === "new" ? "New Bottle" : "Refill";
    const unitPrice =
      item.variant === "new" ? p.newBottlePrice : p.refillPrice;
    const lineTotal = unitPrice * item.quantity;
    return `• ${item.quantity}x ${p.name} (${p.size}) — ${variantLabel} — ₦${lineTotal.toLocaleString()}`;
  });

  const total = cart.reduce((sum, item) => {
    const p = PRODUCTS[item.productId];
    const unitPrice =
      item.variant === "new" ? p.newBottlePrice : p.refillPrice;
    return sum + unitPrice * item.quantity;
  }, 0);

  const message = `Hi Jesmac! I want to place an order:\n\n${lines.join(
    "\n"
  )}\n\n*Total: ₦${total.toLocaleString()}*\n\nPlease confirm my order and send payment details.`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
