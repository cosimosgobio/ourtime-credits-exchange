import { ReactNode } from 'react';
import { NavBar } from './NavBar';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6">
        {children}
      </main>
    </div>
  );
};
