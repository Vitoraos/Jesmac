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

  const getQty = (productId, variant) => {
    const item = cart.find(
      (i) => i.productId === productId && i.variant === variant
    );
    return item ? item.quantity : 0;
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
      {/* ═══ NEW BOTTLES ═══ */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <ShoppingBag size={24} className="text-jesmac-blue" /> New Bottles
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {Object.values(PRODUCTS).map((product) => {
            const qty = getQty(product.id, "new");
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm"
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

                  {qty === 0 ? (
                    <button
                      onClick={() => addToCart(product.id, "new")}
                      className="btn-primary gap-2"
                    >
                      <Plus size={16} /> Add to Order
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 bg-slate-100 rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQty(product.id, "new", -1)}
                        className="w-8 h-8 rounded-full bg-white text-slate-700 flex items-center justify-center shadow-sm hover:bg-slate-200 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-bold text-slate-900 w-4 text-center">
                        {qty}
                      </span>
                      <button
                        onClick={() => addToCart(product.id, "new")}
                        className="w-8 h-8 rounded-full bg-jesmac-blue text-white flex items-center justify-center shadow-sm hover:bg-jesmac-blue-dark transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ REFILLS ═══ */}
      <div className="mb-24">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Refills</h2>
          <span className="px-3 py-1 rounded-full bg-jesmac-lemon/20 text-jesmac-lemon-dark text-xs font-bold">
            Save ₦{SAVINGS_AMOUNT} each
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {Object.values(PRODUCTS).map((product) => {
            const qty = getQty(product.id, "refill");
            return (
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

                  {qty === 0 ? (
                    <button
                      onClick={() => addToCart(product.id, "refill")}
                      className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-jesmac-teal hover:text-white transition-colors flex items-center gap-1"
                    >
                      <Plus size={16} /> Add
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 bg-slate-100 rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQty(product.id, "refill", -1)}
                        className="w-8 h-8 rounded-full bg-white text-slate-700 flex items-center justify-center shadow-sm hover:bg-slate-200 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-bold text-slate-900 w-4 text-center">
                        {qty}
                      </span>
                      <button
                        onClick={() => addToCart(product.id, "refill")}
                        className="w-8 h-8 rounded-full bg-jesmac-teal text-white flex items-center justify-center shadow-sm hover:bg-jesmac-teal-dark transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ STICKY CART ═══ */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_24px_rgba(0,0,0,0.1)] z-40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
            {/* Line items with qty controls */}
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {cart.map((item) => {
                const p = PRODUCTS[item.productId];
                const unitPrice =
                  item.variant === "new"
                    ? p.newBottlePrice
                    : p.refillPrice;
                return (
                  <div
                    key={`${item.productId}-${item.variant}`}
                    className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                        style={{ backgroundColor: p.accentHex }}
                      >
                        {p.color === "lemon" ? "🍋" : "🌿"}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {p.name}
                          <span className="text-slate-500 font-normal">
                            {" "}
                            — {item.variant === "new" ? "Bottle" : "Refill"}
                          </span>
                        </p>
                        <p className="text-xs text-slate-500">
                          ₦{unitPrice.toLocaleString()} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Quantity stepper */}
                      <div className="flex items-center gap-1 bg-white rounded-full border border-slate-200 px-1 py-0.5">
                        <button
                          onClick={() =>
                            updateQty(item.productId, item.variant, -1)
                          }
                          className="w-7 h-7 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-bold text-slate-900 w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQty(item.productId, item.variant, 1)
                          }
                          className="w-7 h-7 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() =>
                          removeItem(item.productId, item.variant)
                        }
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                        aria-label="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total + CTA */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-500">
                  {cartCount} item{cartCount !== 1 ? "s" : ""}
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  ₦{cartTotal.toLocaleString()}
                </p>
              </div>
              <a
                href={generateWhatsAppUrl(cart)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary gap-2"
              >
                <MessageCircle size={18} /> Order on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
