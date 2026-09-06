"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Eye,
  EyeSlash,
  Check,
  Sparkle,
  User,
  Key,
  EnvelopeSimple,
  Fingerprint,
} from "@phosphor-icons/react";

export default function EntrarPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form State
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: true,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      router.push("/produtos");
    }, 1200);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      router.push("/produtos");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-canvas-base text-text-optic py-12 sm:py-20 px-4 sm:px-6 flex items-center justify-center relative overflow-hidden">
      {/* Background Substrate Radial Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255, 255, 255, 0.06) 0%, rgba(12, 13, 16, 0) 100%)",
        }}
      />

      {/* Main Specular Liquid Glass Container */}
      <div className="relative z-10 w-full max-w-lg bg-glass-substrate backdrop-blur-[36px] border-t border-border-specular border-b border-border-subtle shadow-2xl p-6 sm:p-10 space-y-8">
        {/* Monolith Header Emblem */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-canvas-well border border-border-subtle px-3 py-1 text-[11px] font-mono tracking-widest text-text-platinum uppercase">
            <Sparkle className="w-3.5 h-3.5 text-text-optic" weight="light" />
            <span>ACESSO SEGURO // DESAPEGADO ID</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-mono uppercase tracking-wider text-text-optic">
            {activeTab === "login" ? "Entrar na Conta" : "Criar Conta"}
          </h1>

          <p className="text-xs font-mono text-text-platinum max-w-xs mx-auto">
            {activeTab === "login"
              ? "Acesse seu histórico de aquisições, laudos de autenticidade e lances de arquivo."
              : "Cadastre-se para ter acesso exclusivo aos drops limitados e curadoria certificada."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-canvas-well border border-border-subtle font-mono text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab("login");
              setIsSubmitted(false);
            }}
            className={`py-3 uppercase tracking-wider font-bold transition cursor-pointer ${
              activeTab === "login"
                ? "bg-text-optic text-canvas-base shadow"
                : "text-text-slate hover:text-text-optic"
            }`}
          >
            Entrar
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("register");
              setIsSubmitted(false);
            }}
            className={`py-3 uppercase tracking-wider font-bold transition cursor-pointer ${
              activeTab === "register"
                ? "bg-text-optic text-canvas-base shadow"
                : "text-text-slate hover:text-text-optic"
            }`}
          >
            Criar Conta
          </button>
        </div>

        {/* HIGH-CONTRAST FORM CONTAINER (--color-canvas-well) */}
        <div className="bg-canvas-well border border-border-subtle p-6 sm:p-8 space-y-6 shadow-xl">
          {/* TAB 1: LOGIN */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-text-slate uppercase font-bold text-[11px] block">
                  E-mail Cadastrado
                </label>
                <div className="relative flex items-center">
                  <EnvelopeSimple className="w-4 h-4 text-text-slate absolute left-3.5" weight="light" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="seu.email@dominio.com"
                    className="w-full h-11 bg-canvas-base border border-border-subtle pl-10 pr-3.5 text-xs text-text-optic outline-none focus:border-text-optic"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-text-slate uppercase font-bold text-[11px] block">
                    Senha
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("Instruções de redefinição de senha foram enviadas ao seu e-mail cadastrado.")}
                    className="text-[10px] text-text-platinum hover:text-text-optic underline cursor-pointer"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Key className="w-4 h-4 text-text-slate absolute left-3.5" weight="light" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-11 bg-canvas-base border border-border-subtle pl-10 pr-10 text-xs text-text-optic outline-none focus:border-text-optic"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-text-slate hover:text-text-optic cursor-pointer"
                  >
                    {showPassword ? <EyeSlash className="w-4 h-4" weight="light" /> : <Eye className="w-4 h-4" weight="light" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-text-optic"
                />
                <label htmlFor="remember" className="text-[11px] text-text-slate cursor-pointer">
                  Manter conectado neste dispositivo
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitted}
                className="w-full h-12 mt-2 bg-text-optic text-canvas-base font-mono font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.99] transition cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isSubmitted ? (
                  <>
                    <Check className="w-4 h-4" weight="light" />
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <>
                    <span>ACESSAR MINHA CONTA</span>
                    <ArrowRight className="w-4 h-4" weight="light" />
                  </>
                )}
              </button>

              {/* Alternative WebAuthn / Passkey Access */}
              <div className="pt-4 border-t border-border-subtle text-center">
                <button
                  type="button"
                  onClick={() => alert("Simulação Passkey: Chave biométrica física validada.")}
                  className="w-full h-10 bg-canvas-base border border-border-subtle hover:border-text-optic text-text-platinum hover:text-text-optic text-xs font-mono flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Fingerprint className="w-4 h-4" weight="light" />
                  <span>Acesso com Passkey / Biometria</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-text-slate uppercase font-bold text-[11px] block">
                  Nome Completo
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-text-slate absolute left-3.5" weight="light" />
                  <input
                    type="text"
                    required
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    placeholder="Ex: Alexandre Silva"
                    className="w-full h-11 bg-canvas-base border border-border-subtle pl-10 pr-3.5 text-xs text-text-optic outline-none focus:border-text-optic"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-text-slate uppercase font-bold text-[11px] block">
                  E-mail
                </label>
                <div className="relative flex items-center">
                  <EnvelopeSimple className="w-4 h-4 text-text-slate absolute left-3.5" weight="light" />
                  <input
                    type="email"
                    required
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="seu.email@dominio.com"
                    className="w-full h-11 bg-canvas-base border border-border-subtle pl-10 pr-3.5 text-xs text-text-optic outline-none focus:border-text-optic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-text-slate uppercase font-bold text-[11px] block">
                    CPF
                  </label>
                  <input
                    type="text"
                    required
                    value={registerData.cpf}
                    onChange={(e) => setRegisterData({ ...registerData, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    className="w-full h-11 bg-canvas-base border border-border-subtle px-3.5 text-xs text-text-optic outline-none focus:border-text-optic"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-text-slate uppercase font-bold text-[11px] block">
                    Celular
                  </label>
                  <input
                    type="tel"
                    required
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="w-full h-11 bg-canvas-base border border-border-subtle px-3.5 text-xs text-text-optic outline-none focus:border-text-optic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-text-slate uppercase font-bold text-[11px] block">
                    Senha
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full h-11 bg-canvas-base border border-border-subtle px-3.5 text-xs text-text-optic outline-none focus:border-text-optic"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-text-slate uppercase font-bold text-[11px] block">
                    Confirmar Senha
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    placeholder="Repita a senha"
                    className="w-full h-11 bg-canvas-base border border-border-subtle px-3.5 text-xs text-text-optic outline-none focus:border-text-optic"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  checked={registerData.acceptTerms}
                  onChange={(e) => setRegisterData({ ...registerData, acceptTerms: e.target.checked })}
                  className="accent-text-optic mt-0.5"
                />
                <label htmlFor="terms" className="text-[10px] text-text-slate leading-tight cursor-pointer">
                  Declaro que li e concordo com os <strong>Termos de Serviço</strong> e a <strong>Política de Privacidade</strong>.
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitted}
                className="w-full h-12 mt-2 bg-text-optic text-canvas-base font-mono font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-[0.99] transition cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isSubmitted ? (
                  <>
                    <Check className="w-4 h-4" weight="light" />
                    <span>Criando Conta...</span>
                  </>
                ) : (
                  <>
                    <span>CRIAR MINHA CONTA</span>
                    <ArrowRight className="w-4 h-4" weight="light" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Security Seals & Back Link */}
        <div className="flex flex-col items-center gap-3 border-t border-border-subtle pt-4 font-mono text-[11px] text-text-slate">
          <div className="flex items-center justify-center gap-6">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" weight="light" />
              <span>Dados Criptografados</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-text-platinum" weight="light" />
              <span>Autenticação Segura</span>
            </span>
          </div>

          <Link
            href="/"
            className="text-text-platinum hover:text-text-optic transition-colors underline pt-1"
          >
            &larr; Voltar ao Acervo Principal
          </Link>
        </div>
      </div>
    </div>
  );
}
