"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Copy,
  Check,
  UserCheck,
  MapPin,
} from "lucide-react";
import {
  useCartStore,
  AVAILABLE_SHIPPING_METHODS,
  ShippingMethod,
} from "@/features/storefront";

const emptySubscribe = () => () => {};

type CheckoutStep = 1 | 2 | 3 | 4 | 5;

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);

  // Cart Store
  const items = useCartStore((state) => state.items);
  const selectedShipping = useCartStore((state) => state.selectedShipping);
  const setShippingMethod = useCartStore((state) => state.setShippingMethod);
  const storedCep = useCartStore((state) => state.cep);
  const clearCart = useCartStore((state) => state.clearCart);

  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getDiscountAmount = useCartStore((state) => state.getDiscountAmount);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Form States - Step 1: Identificação
  const [identification, setIdentification] = useState({
    name: "Alexandre Silva",
    email: "alexandre.silva@monolith.cc",
    cpf: "123.456.789-00",
    phone: "(11) 98765-4321",
  });

  // Form States - Step 2: Endereço
  const [address, setAddress] = useState({
    cep: storedCep || "01310-100",
    street: "Avenida Paulista",
    number: "1578",
    complement: "Andar 14, Conjunto 142",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    state: "SP",
  });

  // Form States - Step 3: Frete
  const [shippingOption, setShippingOption] = useState<ShippingMethod>(
    selectedShipping || AVAILABLE_SHIPPING_METHODS[1]
  );

  // Form States - Step 4: Pagamento
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "credit_card" | "crypto">("pix");
  const [creditCard, setCreditCard] = useState({
    number: "•••• •••• •••• 4242",
    holder: "ALEXANDRE SILVA",
    expiry: "12/28",
    cvv: "888",
    installments: "1",
  });

  // Step 5: Confirmação Order State
  const [orderNumber, setOrderNumber] = useState("");
  const [copiedPix, setCopiedPix] = useState(false);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-canvas-base py-16 px-4 text-center font-mono text-xs text-text-slate">
        Inicializando checkout seguro...
      </div>
    );
  }

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = shippingOption.price;
  const pixDiscount = paymentMethod === "pix" ? (subtotal - discount) * 0.05 : 0;
  const total = Math.max(0, subtotal - discount - pixDiscount + shipping);

  // Handlers for step advancement
  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleNextFromStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handleNextFromStep3 = () => {
    setShippingMethod(shippingOption);
    setCurrentStep(4);
  };

  const handleFinishOrder = () => {
    const generatedOrder = `MNL-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    setOrderNumber(generatedOrder);
    setCurrentStep(5);
    clearCart();
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText("00020126580014br.gov.bcb.pix0136monolith-forense-pay-9923847291045204000053039865802BR5920MONOLITH ONYX BRASIL6009SAO PAULO62070503***6304E8A2");
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const STEPS_NAV = [
    { num: 1, label: "Identificação" },
    { num: 2, label: "Endereço" },
    { num: 3, label: "Frete" },
    { num: 4, label: "Pagamento" },
    { num: 5, label: "Confirmação" },
  ];

  return (
    <div className="min-h-screen bg-canvas-base text-text-optic py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header and Step Wizard Navigator */}
        <div className="border-b border-border-subtle pb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-mono text-xs text-text-slate uppercase tracking-widest block">
                CHECKOUT FORENSE // AMBIENTE CRIPTOGRAFADO
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-mono uppercase text-text-optic">
                Finalização de Pedido
              </h1>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-canvas-well px-3 py-1.5 border border-border-subtle w-fit">
              <Lock className="w-3.5 h-3.5" />
              <span>SSL 256-BIT ENCRYPTION</span>
            </div>
          </div>

          {/* Stepper Tabs Bar */}
          <div className="grid grid-cols-5 gap-1 pt-2 font-mono text-xs">
            {STEPS_NAV.map((step) => {
              const isPast = currentStep > step.num;
              const isCurrent = currentStep === step.num;

              return (
                <div
                  key={step.num}
                  className={`p-2.5 sm:p-3 border text-center transition ${
                    isCurrent
                      ? "bg-text-optic text-canvas-base border-text-optic font-bold shadow"
                      : isPast
                      ? "bg-canvas-well text-emerald-400 border-border-subtle"
                      : "bg-canvas-base text-text-slate border-border-subtle opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="text-[10px] sm:text-xs">
                      {isPast ? "✓" : `${step.num}.`}
                    </span>
                    <span className="hidden md:inline uppercase text-[11px] truncate">
                      {step.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 5: SUCCESS / CONFIRMATION VIEW */}
        {currentStep === 5 ? (
          <div className="bg-canvas-well border border-border-subtle p-8 sm:p-12 max-w-3xl mx-auto space-y-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="inline-flex items-center gap-2 bg-canvas-base border border-border-subtle px-3 py-1 text-xs font-mono text-text-platinum uppercase">
                <Sparkles className="w-3.5 h-3.5 text-text-optic" />
                <span>LAUDO FORENSE EMITIDO // PROTOCOLO REGISTRADO</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-mono uppercase text-text-optic">
                Pedido Confirmado com Sucesso!
              </h2>
              <p className="text-xs sm:text-sm font-mono text-text-platinum max-w-xl mx-auto">
                Seu pedido foi registrado em nossa custódia forense. Um e-mail com a via digital do laudo pericial e nota fiscal foi enviado para <strong>{identification.email}</strong>.
              </p>
            </div>

            {/* Protocol Card */}
            <div className="bg-canvas-base border border-border-subtle p-5 font-mono text-xs space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-border-subtle">
                <div>
                  <span className="text-text-slate block text-[10px] uppercase">Número do Pedido</span>
                  <span className="text-text-optic font-bold text-sm">{orderNumber}</span>
                </div>
                <div>
                  <span className="text-text-slate block text-[10px] uppercase">Forma de Pagamento</span>
                  <span className="text-text-optic font-bold uppercase">{paymentMethod}</span>
                </div>
                <div>
                  <span className="text-text-slate block text-[10px] uppercase">Método de Envio</span>
                  <span className="text-text-optic font-bold">{shippingOption.label}</span>
                </div>
                <div>
                  <span className="text-text-slate block text-[10px] uppercase">Valor Total</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* PIX instructions if selected */}
              {paymentMethod === "pix" && (
                <div className="p-4 bg-canvas-well border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                      <QrCode className="w-4 h-4" />
                      Pagamento Instantâneo via PIX
                    </span>
                    <span className="text-[10px] text-text-slate">Válido por 15 minutos</span>
                  </div>
                  <p className="text-[11px] text-text-platinum">
                    Copie a chave Pix abaixo ou utilize o leitor de QR Code do seu aplicativo bancário para confirmação imediata.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value="00020126580014br.gov.bcb.pix0136monolith-forense-pay-9923847291045204000053039865802BR5920MONOLITH ONYX BRASIL6009SAO PAULO62070503***6304E8A2"
                      className="flex-1 bg-canvas-base border border-border-subtle px-3 py-2 text-[10px] font-mono text-text-slate select-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="h-9 px-4 bg-text-optic text-canvas-base font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-neutral-200 transition cursor-pointer"
                    >
                      {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPix ? "Copiado" : "Copiar"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Shipping Destination Summary */}
              <div className="pt-2 text-text-slate text-[11px] flex items-start gap-2">
                <MapPin className="w-4 h-4 text-text-platinum shrink-0 mt-0.5" />
                <span>
                  Entrega em: {address.street}, {address.number} - {address.complement}, {address.neighborhood}, {address.city} - {address.state}, CEP {address.cep}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/produtos"
                className="w-full sm:w-auto h-12 px-8 bg-text-optic text-canvas-base font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-neutral-200 transition"
              >
                <span>Voltar ao Acervo Forense</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto h-12 px-6 bg-canvas-base border border-border-subtle text-text-platinum hover:text-text-optic font-mono text-xs uppercase tracking-wider flex items-center justify-center transition"
              >
                Página Inicial
              </Link>
            </div>
          </div>
        ) : (
          /* STEPS 1 TO 4: Two-Column Form + Live Order Summary */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: ACTIVE STEP FORM (High-contrast --color-canvas-well) */}
            <div className="lg:col-span-7 space-y-6">
              {/* STEP 1: IDENTIFICAÇÃO */}
              {currentStep === 1 && (
                <form
                  onSubmit={handleNextFromStep1}
                  className="bg-canvas-well border border-border-subtle p-6 sm:p-8 space-y-6 shadow-xl"
                >
                  <div className="pb-4 border-b border-border-subtle space-y-1">
                    <span className="font-mono text-xs font-bold text-text-slate uppercase tracking-widest">
                      ETAPA 1 DE 4
                    </span>
                    <h2 className="text-xl font-bold font-mono uppercase text-text-optic flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-text-platinum" />
                      <span>Identificação do Comprador</span>
                    </h2>
                  </div>

                  <div className="space-y-4 font-mono text-xs">
                    <div className="space-y-1.5">
                      <label className="text-text-slate uppercase font-bold text-[11px] block">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        required
                        value={identification.name}
                        onChange={(e) => setIdentification({ ...identification, name: e.target.value })}
                        placeholder="Ex: Alexandre Silva"
                        className="w-full h-11 bg-canvas-base border border-border-subtle px-3.5 text-xs text-text-optic outline-none focus:border-text-optic"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-text-slate uppercase font-bold text-[11px] block">
                          E-mail para Laudo e NF-e
                        </label>
                        <input
                          type="email"
                          required
                          value={identification.email}
                          onChange={(e) => setIdentification({ ...identification, email: e.target.value })}
                          placeholder="seu@email.com"
                          className="w-full h-11 bg-canvas-base border border-border-subtle px-3.5 text-xs text-text-optic outline-none focus:border-text-optic"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-text-slate uppercase font-bold text-[11px] block">
                          CPF (Auditoria Fiscal)
                        </label>
                        <input
                          type="text"
                          required
                          value={identification.cpf}
                          onChange={(e) => setIdentification({ ...identification, cpf: e.target.value })}
                          placeholder="000.000.000-00"
                          className="w-full h-11 bg-canvas-base border border-border-subtle px-3.5 text-xs text-text-optic outline-none focus:border-text-optic"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-text-slate uppercase font-bold text-[11px] block">
                        WhatsApp / Celular para Rastreamento
                      </label>
                      <input
                        type="tel"
                        required
                        value={identification.phone}
                        onChange={(e) => setIdentification({ ...identification, phone: e.target.value })}
                        placeholder="(11) 99999-9999"
                        className="w-full h-11 bg-canvas-base border border-border-subtle px-3.5 text-xs text-text-optic outline-none focus:border-text-optic"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                    <Link
                      href="/entrar"
                      className="font-mono text-xs text-text-slate hover:text-text-optic underline"
                    >
                      Já possui conta? Fazer Login
                    </Link>

                    <button
                      type="submit"
                      className="h-12 px-6 bg-text-optic text-canvas-base font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-neutral-200 transition cursor-pointer"
                    >
                      <span>Prosseguir para Endereço</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: ENDEREÇO DE ENTREGA */}
              {currentStep === 2 && (
                <form
                  onSubmit={handleNextFromStep2}
                  className="bg-canvas-well border border-border-subtle p-6 sm:p-8 space-y-6 shadow-xl"
                >
                  <div className="pb-4 border-b border-border-subtle space-y-1">
                    <span className="font-mono text-xs font-bold text-text-slate uppercase tracking-widest">
                      ETAPA 2 DE 4
                    </span>
                    <h2 className="text-xl font-bold font-mono uppercase text-text-optic flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-text-platinum" />
                      <span>Endereço de Destino</span>
                    </h2>
                  </div>

                  <div className="space-y-4 font-mono text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5 sm:col-span-1">
                        <label className="text-text-slate uppercase font-bold text-[11px] block">
                          CEP
                        </label>
                        <input
                          type="text"
                          required
                          value={address.cep}
                          onChange={(e) => setAddress({ ...address, cep: e.target.value })}
                          placeholder="01310-100"
                          className="w-full h-11 bg-canvas-base border border-border-subtle px-3.5 text-xs text-text-optic outline-none focus:border-text-optic"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-text-slate uppercase font-bold text-[11px] block">
                          Logradouro / Rua
                        </label>
                        <input
                          type="text"
                          required
                          value={address.street}
                          onChange={(e) => setAddress({ ...address, street: e.target.value })}
                          placeholder="Avenida Paulista"
                          className="w-full h-11 bg-canvas-base border border-border-subtle px-3.5 text-xs text-text-optic outline-none focus:border-text-optic"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-text-slate uppercase font-bold text-[11px] block">
                          Número
                        </label>
                        <input
                          type="text"
                          required
                          value={address.number}
                          onChange={(e) => setAddress({ ...address, number: e.target.value })}
                          placeholder="1578"
                          className="w-full h-11 bg-canvas-base border border-border-subtle px-3.5 text-xs text-text-optic outline-none focus:border-text-optic"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-text-slate uppercase font-bold text-[11px] block">
                          Complemento
                        </label>
                        <input
                          type="text"
                          value={address.complement}
                          onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                          placeholder="Apto, Sala, Bloco"
                          className="w-full h-11 bg-canvas-base border border-border-subtle px-3.5 text-xs text-text-optic outline-none focus:border-text-optic"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-text-slate uppercase font-bold text-[11px] block">
                          Bairro
                        </label>
                        <input
                          type="text"
                          required
                          value={address.neighborhood}
                          onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                          placeholder="Bela Vista"
                          className="w-full h-11 bg-canvas-base border border-border-subtle px-3.5 text-xs text-text-optic outline-none focus:border-text-optic"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-text-slate uppercase font-bold text-[11px] block">
                          Cidade
                        </label>
                        <input
                          type="text"
                          required
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          placeholder="São Paulo"
                          className="w-full h-11 bg-canvas-base border border-border-subtle px-3.5 text-xs text-text-optic outline-none focus:border-text-optic"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-text-slate uppercase font-bold text-[11px] block">
                          Estado (UF)
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={2}
                          value={address.state}
                          onChange={(e) => setAddress({ ...address, state: e.target.value.toUpperCase() })}
                          placeholder="SP"
                          className="w-full h-11 bg-canvas-base border border-border-subtle px-3.5 text-xs text-text-optic outline-none focus:border-text-optic uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="font-mono text-xs text-text-slate hover:text-text-optic flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Voltar</span>
                    </button>

                    <button
                      type="submit"
                      className="h-12 px-6 bg-text-optic text-canvas-base font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-neutral-200 transition cursor-pointer"
                    >
                      <span>Prosseguir para Frete</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: FRETE & LOGÍSTICA */}
              {currentStep === 3 && (
                <div className="bg-canvas-well border border-border-subtle p-6 sm:p-8 space-y-6 shadow-xl">
                  <div className="pb-4 border-b border-border-subtle space-y-1">
                    <span className="font-mono text-xs font-bold text-text-slate uppercase tracking-widest">
                      ETAPA 3 DE 4
                    </span>
                    <h2 className="text-xl font-bold font-mono uppercase text-text-optic flex items-center gap-2">
                      <Truck className="w-5 h-5 text-text-platinum" />
                      <span>Modalidade de Envio Forense</span>
                    </h2>
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    {AVAILABLE_SHIPPING_METHODS.map((method) => (
                      <label
                        key={method.id}
                        className={`p-4 border block cursor-pointer transition ${
                          shippingOption.id === method.id
                            ? "bg-canvas-base border-text-optic text-text-optic shadow-md"
                            : "bg-canvas-base/50 border-border-subtle text-text-platinum hover:border-border-specular"
                        }`}
                      >
                        <div className="flex items-center justify-between pb-1">
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="checkout_shipping"
                              checked={shippingOption.id === method.id}
                              onChange={() => setShippingOption(method)}
                              className="accent-text-optic"
                            />
                            <span className="font-bold text-sm text-text-optic">{method.label}</span>
                          </div>
                          <span className="font-bold text-sm text-text-optic">
                            R$ {method.price.toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                        <div className="pl-6 text-[11px] text-text-slate space-y-0.5">
                          <p>{method.carrier} • Prazo estimado: <strong>{method.estimatedDays}</strong></p>
                          <p>{method.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="font-mono text-xs text-text-slate hover:text-text-optic flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Voltar</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextFromStep3}
                      className="h-12 px-6 bg-text-optic text-canvas-base font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-neutral-200 transition cursor-pointer"
                    >
                      <span>Prosseguir para Pagamento</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: PAGAMENTO */}
              {currentStep === 4 && (
                <div className="bg-canvas-well border border-border-subtle p-6 sm:p-8 space-y-6 shadow-xl">
                  <div className="pb-4 border-b border-border-subtle space-y-1">
                    <span className="font-mono text-xs font-bold text-text-slate uppercase tracking-widest">
                      ETAPA 4 DE 4
                    </span>
                    <h2 className="text-xl font-bold font-mono uppercase text-text-optic flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-text-platinum" />
                      <span>Forma de Pagamento</span>
                    </h2>
                  </div>

                  {/* Payment Method Selector Tabs */}
                  <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("pix")}
                      className={`p-3 border font-bold uppercase transition flex flex-col items-center gap-1.5 cursor-pointer ${
                        paymentMethod === "pix"
                          ? "bg-text-optic text-canvas-base border-text-optic"
                          : "bg-canvas-base text-text-slate border-border-subtle hover:text-text-optic"
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      <span>PIX (5% OFF)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("credit_card")}
                      className={`p-3 border font-bold uppercase transition flex flex-col items-center gap-1.5 cursor-pointer ${
                        paymentMethod === "credit_card"
                          ? "bg-text-optic text-canvas-base border-text-optic"
                          : "bg-canvas-base text-text-slate border-border-subtle hover:text-text-optic"
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Cartão 12x</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("crypto")}
                      className={`p-3 border font-bold uppercase transition flex flex-col items-center gap-1.5 cursor-pointer ${
                        paymentMethod === "crypto"
                          ? "bg-text-optic text-canvas-base border-text-optic"
                          : "bg-canvas-base text-text-slate border-border-subtle hover:text-text-optic"
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Cripto Vault</span>
                    </button>
                  </div>

                  {/* PIX Form Content */}
                  {paymentMethod === "pix" && (
                    <div className="p-4 bg-canvas-base border border-emerald-500/30 font-mono text-xs space-y-3">
                      <div className="flex items-center justify-between text-emerald-400 font-bold">
                        <span>Desconto PIX Aplicado: 5%</span>
                        <span>- R$ {pixDiscount.toFixed(2).replace(".", ",")}</span>
                      </div>
                      <p className="text-[11px] text-text-platinum leading-relaxed">
                        Ao clicar em &apos;Finalizar Pedido Forense&apos;, o QR Code dinâmico e o código Pix Copia-e-Cola serão gerados instantaneamente com liquidação imediata em até 3 segundos.
                      </p>
                    </div>
                  )}

                  {/* Credit Card Form Content */}
                  {paymentMethod === "credit_card" && (
                    <div className="space-y-4 font-mono text-xs">
                      <div className="space-y-1.5">
                        <label className="text-text-slate uppercase font-bold text-[11px] block">
                          Número do Cartão
                        </label>
                        <input
                          type="text"
                          value={creditCard.number}
                          onChange={(e) => setCreditCard({ ...creditCard, number: e.target.value })}
                          placeholder="4532 •••• •••• ••••"
                          className="w-full h-11 bg-canvas-base border border-border-subtle px-3.5 text-xs text-text-optic outline-none focus:border-text-optic"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-text-slate uppercase font-bold text-[11px] block">
                          Nome Impresso no Cartão
                        </label>
                        <input
                          type="text"
                          value={creditCard.holder}
                          onChange={(e) => setCreditCard({ ...creditCard, holder: e.target.value.toUpperCase() })}
                          placeholder="ALEXANDRE SILVA"
                          className="w-full h-11 bg-canvas-base border border-border-subtle px-3.5 text-xs text-text-optic outline-none focus:border-text-optic uppercase"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-text-slate uppercase font-bold text-[11px] block">
                            Validade (MM/AA)
                          </label>
                          <input
                            type="text"
                            value={creditCard.expiry}
                            onChange={(e) => setCreditCard({ ...creditCard, expiry: e.target.value })}
                            placeholder="12/28"
                            className="w-full h-11 bg-canvas-base border border-border-subtle px-3.5 text-xs text-text-optic outline-none focus:border-text-optic"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-text-slate uppercase font-bold text-[11px] block">
                            CVV
                          </label>
                          <input
                            type="text"
                            maxLength={4}
                            value={creditCard.cvv}
                            onChange={(e) => setCreditCard({ ...creditCard, cvv: e.target.value })}
                            placeholder="123"
                            className="w-full h-11 bg-canvas-base border border-border-subtle px-3.5 text-xs text-text-optic outline-none focus:border-text-optic"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-text-slate uppercase font-bold text-[11px] block">
                          Opções de Parcelamento
                        </label>
                        <select
                          value={creditCard.installments}
                          onChange={(e) => setCreditCard({ ...creditCard, installments: e.target.value })}
                          className="w-full h-11 bg-canvas-base border border-border-subtle px-3 text-xs text-text-optic outline-none cursor-pointer"
                        >
                          <option value="1">1x de R$ {total.toFixed(2).replace(".", ",")} sem juros</option>
                          <option value="2">2x de R$ {(total / 2).toFixed(2).replace(".", ",")} sem juros</option>
                          <option value="3">3x de R$ {(total / 3).toFixed(2).replace(".", ",")} sem juros</option>
                          <option value="6">6x de R$ {(total / 6).toFixed(2).replace(".", ",")} sem juros</option>
                          <option value="12">12x de R$ {(total / 12).toFixed(2).replace(".", ",")} sem juros</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Crypto Vault Content */}
                  {paymentMethod === "crypto" && (
                    <div className="p-4 bg-canvas-base border border-border-subtle font-mono text-xs space-y-2">
                      <span className="font-bold text-text-optic uppercase block">USDT (TRC-20 / ERC-20) / BTC</span>
                      <p className="text-[11px] text-text-slate">
                        Ao prosseguir, você receberá a carteira multi-sig auditada Monolith Vault para liquidação on-chain em dólares digitais ou Bitcoin.
                      </p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="font-mono text-xs text-text-slate hover:text-text-optic flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Voltar</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleFinishOrder}
                      className="h-14 px-8 bg-text-optic text-canvas-base font-mono font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-neutral-200 transition cursor-pointer shadow-xl"
                    >
                      <span>FINALIZAR PEDIDO FORENSE</span>
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: STICKY ORDER SUMMARY (High-Contrast Well) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-canvas-well border border-border-subtle p-6 space-y-6 shadow-2xl sticky top-24 font-mono text-xs">
                <div className="pb-3 border-b border-border-subtle font-bold uppercase tracking-widest text-text-optic flex items-center justify-between">
                  <span>Resumo do Pedido</span>
                  <span className="text-text-slate">{items.length} itens</span>
                </div>

                {/* Items preview */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-border-subtle">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="pt-2 flex items-center gap-3">
                      <div className="relative w-12 aspect-[4/5] bg-canvas-base border border-border-subtle shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-text-optic block truncate">{item.brand}</span>
                        <span className="text-[11px] text-text-platinum block truncate">{item.name}</span>
                        <span className="text-[10px] text-text-slate">Tam: {item.size} • Qtd: {item.quantity}</span>
                      </div>
                      <div className="font-bold text-text-optic text-right">
                        R$ {(item.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals Breakdown */}
                <div className="pt-4 border-t border-border-subtle space-y-2 text-text-platinum">
                  <div className="flex items-center justify-between">
                    <span>Subtotal:</span>
                    <span className="text-text-optic font-bold">
                      R$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex items-center justify-between text-emerald-400">
                      <span>Desconto de Cupom:</span>
                      <span className="font-bold">
                        - R$ {discount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}

                  {pixDiscount > 0 && (
                    <div className="flex items-center justify-between text-emerald-400">
                      <span>Desconto PIX (5%):</span>
                      <span className="font-bold">
                        - R$ {pixDiscount.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span>Frete ({shippingOption.label}):</span>
                    <span className="text-text-optic font-bold">
                      R$ {shipping.toFixed(2).replace(".", ",")}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-border-subtle flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-text-slate uppercase block">Total a Pagar</span>
                      <span className="text-2xl sm:text-3xl font-black text-text-optic">
                        R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">
                      PROCESSO BLINDADO
                    </span>
                  </div>
                </div>

                {/* Security badges */}
                <div className="pt-4 border-t border-border-subtle space-y-2 text-[11px] text-text-slate">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Autenticação pericial pré-despacho</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-text-platinum shrink-0" />
                    <span>Pagamento protegido contra fraudes</span>
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
