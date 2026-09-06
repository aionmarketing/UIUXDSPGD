"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  Check,
  Lock,
} from "lucide-react";
import {
  useCartStore,
  AVAILABLE_SHIPPING_METHODS,
} from "@/features/storefront";

const emptySubscribe = () => () => {};

export default function CartPage() {
  const router = useRouter();

  // Zustand Store selectors and actions
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const selectedShipping = useCartStore((state) => state.selectedShipping);
  const setShippingMethod = useCartStore((state) => state.setShippingMethod);
  const cep = useCartStore((state) => state.cep);
  const setCep = useCartStore((state) => state.setCep);
  const couponCode = useCartStore((state) => state.couponCode);
  const couponError = useCartStore((state) => state.couponError);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);

  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getDiscountAmount = useCartStore((state) => state.getDiscountAmount);
  const getShippingPrice = useCartStore((state) => state.getShippingPrice);
  const getTotal = useCartStore((state) => state.getTotal);
  const getItemCount = useCartStore((state) => state.getItemCount);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Local inputs
  const [inputCep, setInputCep] = useState(cep || "01310-100");
  const [inputCoupon, setInputCoupon] = useState("");
  const [couponSuccess, setCouponSuccess] = useState(false);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-canvas-base py-16 px-4 text-center font-mono text-xs text-text-slate">
        Carregando sua sacola...
      </div>
    );
  }

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingPrice();
  const total = getTotal();
  const itemCount = getItemCount();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const ok = applyCoupon(inputCoupon);
    if (ok) {
      setCouponSuccess(true);
      setTimeout(() => setCouponSuccess(false), 3000);
    }
  };

  const handleApplyCep = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCep.trim().length >= 8) {
      setCep(inputCep);
    }
  };

  return (
    <div className="min-h-screen bg-canvas-base text-text-optic py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header Bar */}
        <div className="border-b border-border-subtle pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <nav className="flex items-center gap-2 font-mono text-xs text-text-slate">
              <Link href="/" className="hover:text-text-optic transition-colors">
                Início
              </Link>
              <span>/</span>
              <span className="text-text-optic font-bold">Sacola de Compras</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-extrabold uppercase font-mono tracking-tight text-text-optic flex items-center gap-3">
              <ShoppingBag className="w-7 h-7 text-text-optic" />
              <span>Sua Sacola</span>
              <span className="text-base font-normal text-text-slate font-mono">
                ({itemCount} {itemCount === 1 ? "peça" : "peças"})
              </span>
            </h1>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-mono text-text-slate hover:text-red-400 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Esvaziar Sacola</span>
            </button>
          )}
        </div>

        {/* Empty Cart State */}
        {items.length === 0 ? (
          <div className="bg-canvas-well border border-border-subtle p-12 sm:p-16 text-center space-y-6 max-w-2xl mx-auto shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-full bg-canvas-base border border-border-subtle flex items-center justify-center text-text-slate">
              <ShoppingBag className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold font-mono uppercase text-text-optic">
                Sua sacola está vazia
              </h2>
              <p className="text-xs sm:text-sm font-mono text-text-platinum max-w-md mx-auto">
                Você ainda não adicionou nenhum item de arquivo ou passarela ao seu carrinho. Explore nosso acervo catalogado e autenticado.
              </p>
            </div>

            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 h-12 px-8 bg-text-optic text-canvas-base font-mono font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition"
            >
              <span>Explorar Catálogo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Main Two-Column Viewport: Items & Summary */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Items List + Shipping Calc + Coupon (High-Contrast Wells) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Items List Well */}
              <div className="bg-canvas-well border border-border-subtle divide-y divide-border-subtle shadow-xl">
                <div className="p-4 sm:p-5 flex items-center justify-between font-mono text-xs text-text-slate uppercase tracking-wider">
                  <span>Item &amp; Detalhes</span>
                  <span className="hidden sm:inline">Subtotal</span>
                </div>

                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 group"
                  >
                    {/* Image and Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <Link
                        href={`/produtos/${item.slug}`}
                        className="relative w-20 sm:w-24 aspect-[4/5] bg-canvas-base border border-border-subtle overflow-hidden shrink-0"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </Link>

                      <div className="space-y-1 font-mono">
                        <span className="text-[11px] font-bold text-text-optic uppercase tracking-wider block">
                          {item.brand}
                        </span>
                        <Link
                          href={`/produtos/${item.slug}`}
                          className="text-xs sm:text-sm font-medium text-text-platinum hover:text-text-optic line-clamp-2 leading-snug transition-colors"
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[10px] bg-canvas-base border border-border-subtle px-2 py-0.5 text-text-platinum font-bold uppercase">
                            TAM: {item.size}
                          </span>
                          <span className="text-[10px] bg-canvas-base border border-border-subtle px-2 py-0.5 text-emerald-400 font-bold uppercase">
                            {item.condition}
                          </span>
                        </div>
                        <div className="sm:hidden pt-1 font-bold text-sm text-text-optic">
                          R$ {(item.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls and Remove */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border-subtle">
                      <div className="flex items-center border border-border-subtle bg-canvas-base">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          aria-label="Diminuir quantidade"
                          className="w-8 h-8 flex items-center justify-center text-text-platinum hover:text-text-optic hover:bg-canvas-well transition cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-mono text-xs font-bold text-text-optic">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          aria-label="Aumentar quantidade"
                          className="w-8 h-8 flex items-center justify-center text-text-platinum hover:text-text-optic hover:bg-canvas-well transition cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Desktop Price */}
                      <div className="hidden sm:block text-right font-mono min-w-[100px]">
                        <span className="text-sm font-bold text-text-optic block">
                          R$ {(item.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] text-text-slate">
                          R$ {item.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} un.
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeItem(item.id, item.size)}
                        aria-label="Remover item da sacola"
                        className="text-text-slate hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Two Secondary Wells: Shipping Calc & Coupon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* SHIPPING CALCULATION WELL (--color-canvas-well) */}
                <div className="bg-canvas-well border border-border-subtle p-5 space-y-4 shadow-lg">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-text-optic">
                    <Truck className="w-4 h-4 text-text-platinum" />
                    <span>Calcular Frete e Prazo</span>
                  </div>

                  <form onSubmit={handleApplyCep} className="flex gap-2">
                    <input
                      type="text"
                      value={inputCep}
                      onChange={(e) => setInputCep(e.target.value)}
                      placeholder="CEP de entrega (Ex: 01310-100)"
                      className="flex-1 h-10 bg-canvas-base border border-border-subtle px-3 text-xs font-mono text-text-optic outline-none focus:border-text-optic"
                    />
                    <button
                      type="submit"
                      className="h-10 px-4 bg-canvas-base border border-border-subtle hover:border-text-optic text-text-optic font-mono font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                    >
                      OK
                    </button>
                  </form>

                  {/* Shipping Options Selector */}
                  <div className="space-y-2 pt-1 font-mono text-xs">
                    {AVAILABLE_SHIPPING_METHODS.map((method) => (
                      <label
                        key={method.id}
                        className={`p-3 border flex items-center justify-between cursor-pointer transition ${
                          selectedShipping?.id === method.id
                            ? "bg-canvas-base border-text-optic text-text-optic"
                            : "bg-canvas-base/50 border-border-subtle text-text-platinum hover:border-border-specular"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="cart_shipping"
                            checked={selectedShipping?.id === method.id}
                            onChange={() => setShippingMethod(method)}
                            className="accent-text-optic"
                          />
                          <div>
                            <span className="font-bold block text-xs">{method.label}</span>
                            <span className="text-[10px] text-text-slate">{method.estimatedDays}</span>
                          </div>
                        </div>
                        <span className="font-bold text-xs">
                          R$ {method.price.toFixed(2).replace(".", ",")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* COUPON VOUCHER WELL (--color-canvas-well) */}
                <div className="bg-canvas-well border border-border-subtle p-5 space-y-4 shadow-lg flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-text-optic">
                      <Tag className="w-4 h-4 text-text-platinum" />
                      <span>Cupom de Desconto</span>
                    </div>

                    {couponCode ? (
                      <div className="p-3 bg-canvas-base border border-emerald-500/30 flex items-center justify-between font-mono text-xs">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <Check className="w-4 h-4" />
                          <span>Cupom <strong>{couponCode}</strong> aplicado!</span>
                        </div>
                        <button
                          type="button"
                          onClick={removeCoupon}
                          className="text-text-slate hover:text-red-400 underline text-[11px]"
                        >
                          Remover
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={inputCoupon}
                            onChange={(e) => setInputCoupon(e.target.value)}
                            placeholder="Insira o código (ex: ONYX10)"
                            className="flex-1 h-10 bg-canvas-base border border-border-subtle px-3 text-xs font-mono text-text-optic uppercase outline-none focus:border-text-optic"
                          />
                          <button
                            type="submit"
                            className="h-10 px-4 bg-canvas-base border border-border-subtle hover:border-text-optic text-text-optic font-mono font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                          >
                            Aplicar
                          </button>
                        </div>
                        {couponError && (
                          <span className="text-red-400 text-[11px] font-mono block">
                            {couponError}
                          </span>
                        )}
                        {couponSuccess && (
                          <span className="text-emerald-400 text-[11px] font-mono block">
                            Desconto de 10% aplicado com sucesso!
                          </span>
                        )}
                      </form>
                    )}
                  </div>

                  <div className="p-2.5 bg-canvas-base border border-border-subtle text-[11px] font-mono text-text-slate">
                    💡 Dica: Use o cupom <strong>PRIMEIRACOMPRA</strong> para obter 10% de desconto no seu primeiro pedido curado.
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Order Summary Well (--color-canvas-well) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-canvas-well border border-border-subtle p-6 space-y-6 shadow-2xl sticky top-24">
                <div className="pb-3 border-b border-border-subtle font-mono text-xs font-bold uppercase tracking-widest text-text-optic flex items-center justify-between">
                  <span>Resumo do Pedido</span>
                  <span className="text-emerald-400">CERTIFICADO</span>
                </div>

                {/* Subtotals breakdown */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-text-platinum">
                    <span>Subtotal de Peças:</span>
                    <span className="text-text-optic font-bold">
                      R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex items-center justify-between text-emerald-400">
                      <span>Desconto ({couponCode}):</span>
                      <span className="font-bold">
                        - R$ {discount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-text-platinum">
                    <span>Frete:</span>
                    <span className="text-text-optic font-bold">
                      {shipping > 0
                        ? `R$ ${shipping.toFixed(2).replace(".", ",")}`
                        : "A calcular"}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-border-subtle flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-text-slate uppercase tracking-wider block">
                        Total Final
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-text-optic">
                        R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                      À VISTA OU ATÉ 12X
                    </span>
                  </div>
                </div>

                {/* Primary Checkout CTA */}
                <button
                  type="button"
                  onClick={() => router.push("/checkout")}
                  className="w-full h-14 min-h-[50px] bg-text-optic text-canvas-base font-mono font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 hover:bg-neutral-200 active:scale-[0.99] transition cursor-pointer shadow-lg"
                >
                  <span>AVANÇAR PARA O CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  href="/produtos"
                  className="block text-center font-mono text-xs text-text-platinum hover:text-text-optic uppercase underline transition-colors"
                >
                  Continuar Garimpando &rarr;
                </Link>

                {/* Trust and Forensics Guarantees */}
                <div className="pt-4 border-t border-border-subtle space-y-2.5 font-mono text-[11px] text-text-slate">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-text-platinum shrink-0" />
                    <span>Ambiente Criptografado SSL 256-bit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Garantia de Autenticidade ou 100% Reembolso</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-text-platinum shrink-0" />
                    <span>Lacre de Segurança Inviolável com Certificado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
