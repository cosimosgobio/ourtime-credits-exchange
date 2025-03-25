
import { ReactNode } from 'react';
import { NavBar } from './NavBar';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 pt-20 pb-8 px-4 sm:px-6 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};
