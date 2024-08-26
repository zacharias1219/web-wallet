import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-primary text-white">
      <header className="p-4 text-center text-2xl font-bold">Web-Based Wallet</header>
      <main className="p-4">{children}</main>
    </div>
  );
}
