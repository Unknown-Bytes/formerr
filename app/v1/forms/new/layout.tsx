"use client";
import React from 'react';
import { FormProvider } from '@/app/v1/forms/new/formcontext';


import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
        <FormProvider>{children}</FormProvider>
  )
}

  

  