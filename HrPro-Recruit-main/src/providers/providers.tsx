'use client';
import { FC, ReactNode } from 'react';
import AuthProvider from './auth-provider';
import { ThemeProvider } from './theme-provider';
import { Toaster } from '@/components/ui/toaster';

const Provider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Toaster />
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Provider;
