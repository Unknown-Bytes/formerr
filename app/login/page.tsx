'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import * as React from "react"
import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import Link from "next/link"


export default function Login() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1;
    }
  }, []);


  return (
    <div className="relative w-full h-dvh content-center p-8 overflow-hidden bg-black text-white font-sans">
      {/* Background video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-1/2 left-1/2 min-w-[100vh] min-h-[100vw] w-auto h-auto object-cover z-0 -translate-x-1/2 -translate-y-1/2 transform rotate-90 md:rotate-0"
      >
        <source src="/content/12817774_3840_2160_30fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Glassmorphic container */}
      <div className="inset-0 flex items-center justify-center z-10">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-10 max-w-md w-full text-center shadow-2xl">
          <div className="flex justify-center mb-6">
            <Image src="/content/logo-f-glass.png" alt="Formerr logo" width={128} height={128} />
          </div>
          <h1 className="text-2xl font-semibold mb-4">Bem-vindo ao Formerr</h1>
          <p className="text-gray-300 mb-8">
            Simples. Elegante. Focado na experiência. Construa formulários como nunca antes.
          </p>
          <Link href="/login/github" passHref>
            <Button className="w-full mb-5 text-gray-700 dark:text-gray-300" variant="outline" disabled={isLoading}>
              {isLoading ? (
                <Icons.spinner className="h-4 w-4 animate-spin" />
              ) : (
                <Icons.gitHub className="mr-2 h-4 w-4" />
              )}
              GitHub
            </Button>
          </Link>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Ao continuar, você concorda com nossos{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Termos de Serviço
            </Link>{" "}
            e{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary relative">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}