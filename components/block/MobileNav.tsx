'use client';

import { LayoutDashboard, Inbox, Settings } from "lucide-react";
import { MobileMenu } from "@/components/block/MobileMenu";

interface MobileNavProps {
  image: string;
}

export function MobileNav({ image }: MobileNavProps) {
  return (
    <nav className="flex justify-around items-center p-4 px-4">
      <button
        aria-label="Dashboard"
        className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-900 transition"
        onClick={() => (window.location.href = '/v1/dashboard')}>
        <LayoutDashboard color="currentColor" className="text-black dark:text-gray-100" size={32} />
      </button>

      <button
        aria-label="Respostas"
        className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-900 transition"
        onClick={() => (window.location.href = '')}>
        <Inbox />
      </button>

      <button
        aria-label="Settings"
        className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-900 transition"
        onClick={() => (window.location.href = '')}>
        <Settings />
      </button>

      <button aria-label="Menu" className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-900 transition">
        <MobileMenu image={image} />
      </button>
    </nav>
  )
}