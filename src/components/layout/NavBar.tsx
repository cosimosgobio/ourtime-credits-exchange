import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, CreditCard, Award, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Earn Credits', path: '/earn', icon: Award },
    { name: 'Use Credits', path: '/use', icon: CreditCard },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const NavLink = ({ item }: { item: { name: string; path: string; icon: any } }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <Link
        to={item.path}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
          isActive 
            ? 'bg-primary/10 text-primary font-medium' 
            : 'text-foreground/80 hover:bg-secondary hover:text-foreground'
        )}
      >
        <item.icon size={18} />
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled ? 'glass shadow-sm py-2' : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center space-x-2"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative w-8 h-8 bg-primary flex items-center justify-center rounded-sm">
            <span className="text-accent font-bold text-lg">OT</span>
          </div>
          <span className="font-semibold text-xl tracking-tight">OurTime</span>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </nav>
        )}

        {/* Mobile Navigation Toggle */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && (
        <div
          className={cn(
            'fixed inset-0 bg-background/95 backdrop-blur-sm z-50 transition-transform duration-300 ease-in-out transform',
            isOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex flex-col h-full pt-20 px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4"
              aria-label="Close menu"
            >
              <X size={24} />
            </Button>
            
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <NavLink key={item.name} item={item} />
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
