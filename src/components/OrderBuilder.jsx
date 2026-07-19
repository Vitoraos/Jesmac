import { useState } from "react";
import { Plus, Minus, MessageCircle, ShoppingBag, Trash2 } from "lucide-react";
import { PRODUCTS, SAVINGS_AMOUNT } from "../lib/data.js";
import { generateWhatsAppUrl } from "../lib/whatsapp.js";

export default function OrderBuilder() {
  const [cart, setCart] = useState([]);

  const addToCart = (productId, variant) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.productId === productId && i.variant === variant
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === productId && i.variant === variant
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { productId, variant, quantity: 1 }];
    });
  };

  const updateQty = (productId, variant, delta) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.productId === productId && i.variant === variant
            ? { ...i, quantity: Math.max(0, i.quantity + delta) }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (productId, variant) => {
    setCart((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && i.variant === variant)
      )
    );
  };

  const cartTotal = cart.reduce((sum, item) => {
    const p = PRODUCTS[item.productId];
    const price =
      item.variant === "new" ? p.newBottlePrice : p.refillPrice;
    return sum + price * item.quantity;
  }, 0);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* New Bottles */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <ShoppingBag size={24} className="text-jesmac-blue" /> New Bottles
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {Object.values(PRODUCTS).map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-3"
                    style={{ backgroundColor: product.accentHex }}
                  >
                    {product.color === "lemon" ? "🍋" : "🌿"}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {product.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <span className="text-2xl font-bold text-slate-900">
                  ₦{product.newBottlePrice.toLocaleString()}
                </span>
                <button
                  onClick={() => addToCart(product.id, "new")}
                  className="btn-primary gap-2"
                >
                  <Plus size={16} /> Add to Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Refills */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Refills</h2>
          <span className="px-3 py-1 rounded-full bg-jesmac-lemon/20 text-jesmac-lemon-dark text-xs font-bold">
            Save ₦{SAVINGS_AMOUNT} each
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {Object.values(PRODUCTS).map((product) => (
            <div
              key={`${product.id}-refill`}
              className="bg-white rounded-2xl border border-dashed border-slate-300 p-6 hover:border-jesmac-teal/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-slate-900">
                  {product.name} — Refill
                </h3>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  {product.size} pouch
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Same formula. No bottle. Pour into your existing Jesmac
                container.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-jesmac-teal">
                    ₦{product.refillPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-slate-400 line-through">
                    ₦{product.newBottlePrice.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => addToCart(product.id, "refill")}
                  className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-jesmac-teal hover:text-white transition-colors flex items-center gap-1"
                >
                  <Plus size={16} /> Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Cart */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-600 mb-2">
                  {cartCount} item{cartCount !== 1 ? "s" : ""} in your order:
                </p>
                <div className="flex flex-wrap gap-2">
                  {cart.map((item) => {
                    const p = PRODUCTS[item.productId];
                    return (
                      <span
                        key={`${item.productId}-${item.variant}`}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
                      >
                        {item.quantity}x {p.name} (
                        {item.variant === "new" ? "Bottle" : "Refill"})
                        <button
                          onClick={() =>
                            removeItem(item.productId, item.variant)
                          }
                          className="ml-1 hover:text-red-500"
                        >
                          <Trash2 size={12} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <p className="text-xs text-slate-500">Total</p>
                  <p className="text-2xl font-bold text-slate-900">
                    ₦{cartTotal.toLocaleString()}
                  </p>
                </div>
                <a
                  href={generateWhatsAppUrl(cart)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary gap-2 whitespace-nowrap"
                >
                  <MessageCircle size={18} /> Order on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
