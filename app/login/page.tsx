'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import * as React from "react";
import { Icons, Button } from "@/components/ui";
import Link from "next/link";
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Users,
  Github,
  ChevronRight
} from "lucide-react";

export default function Login() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8; // Slightly slower for more elegant feel
    }
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Criação Rápida",
      description: "Configure formulários em minutos, não horas"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Seguro & Privado",
      description: "Seus dados protegidos com máxima segurança"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Fácil Colaboração",
      description: "Compartilhe e colete respostas sem complicação"
    }
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* Enhanced Background video with overlay */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 opacity-40"
        >
          <source src="/content/12817774_3840_2160_30fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex h-dvh">
        {/* Left side - Hero content */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
          <div className="max-w-lg">
            {/* Logo and brand */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center">
                <Image src="/content/logo-f-glass.png" alt="Formerr logo" width={32} height={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Formerr</h1>
                <p className="text-blue-200 text-sm">Formulários Reimaginados</p>
              </div>
            </div>

            {/* Main headline */}
            <div className="space-y-6 mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Construa formulários
                <span className="block text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text">
                  como nunca antes
                </span>
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Simples. Elegante. Focado na experiência. 
                Crie formulários profissionais que seus usuários vão adorar responder.
              </p>
            </div>

            {/* Features carousel */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${
                    index === currentFeature
                      ? 'bg-white/10 border-white/30 backdrop-blur-sm'
                      : 'bg-white/5 border-white/10 hover:bg-white/8'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    index === currentFeature
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-blue-300'
                  }`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{feature.title}</h3>
                    <p className="text-blue-200 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social proof placeholder */}
            <div className="flex items-center gap-6 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Mais de 1.000 formulários criados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full max-w-md flex items-center justify-center p-8">
          <div className="w-full">
            {/* Enhanced glassmorphic container */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center mx-auto mb-4">
                  <Image src="/content/logo-f-glass.png" alt="Formerr logo" width={40} height={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Bem-vindo de volta
                </h3>
                <p className="text-blue-200">
                  Entre para continuar criando formulários incríveis
                </p>
              </div>

              {/* Login button */}
              <div className="space-y-4 mb-6">
                <Link href="/login/github" passHref>
                  <Button 
                    className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-xl border-0 shadow-lg hover:shadow-xl transition-all duration-200 group"
                    variant="default" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Icons.spinner className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Github className="mr-3 h-5 w-5" />
                        <span>Continuar com GitHub</span>
                        <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </Button>
                </Link>

                {/* Alternative login options placeholder */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-transparent text-blue-200">Mais opções em breve</span>
                  </div>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm text-blue-200">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Login seguro e criptografado</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-blue-200">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>Acesso instantâneo aos seus formulários</span>
                </div>
              </div>

              {/* Terms and Privacy */}
              <div className="text-center">
                <p className="text-xs text-blue-300 leading-relaxed">
                  Ao continuar, você concorda com nossos{" "}
                  <Link 
                    href="/terms" 
                    className="underline underline-offset-2 hover:text-white transition-colors"
                  >
                    Termos de Serviço
                  </Link>{" "}
                  e{" "}
                  <Link 
                    href="/privacy" 
                    className="underline underline-offset-2 hover:text-white transition-colors"
                  >
                    Política de Privacidade
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-6 text-center">
              <p className="text-blue-200 text-sm">
                Novo no Formerr?{" "}
                <Link href="/signup" className="text-white font-medium hover:underline">
                  Crie sua conta gratuita
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}