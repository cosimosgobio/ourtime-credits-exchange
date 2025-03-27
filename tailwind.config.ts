import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(175, 80%, 40%)',
          foreground: 'hsl(0, 0%, 100%)'
        },
        accent: {
          DEFAULT: 'hsl(15, 90%, 65%)',
          foreground: 'hsl(0, 0%, 100%)'
        },
        card: {
          DEFAULT: 'hsl(180, 30%, 98%)',
          foreground: 'hsl(180, 30%, 20%)'
        },
        background: {
          DEFAULT: 'hsl(180, 15%, 95%)',
          foreground: 'hsl(180, 30%, 20%)'
        },
        muted: {
          DEFAULT: 'hsl(180, 20%, 90%)',
          foreground: 'hsl(180, 20%, 40%)'
        },
        border: 'hsl(180, 31.8%, 91.4%)',
        input: 'hsl(180, 31.8%, 91.4%)',
        ring: 'hsl(175, 80%, 40%)',
        secondary: {
          DEFAULT: 'hsl(180, 40%, 96.1%)',
          foreground: 'hsl(180, 47.4%, 11.2%)'
        },
        destructive: {
          DEFAULT: 'hsl(0, 84.2%, 60.2%)',
          foreground: 'hsl(0, 0%, 98%)'
        },
        popover: {
          DEFAULT: 'hsl(0, 0%, 100%)',
          foreground: 'hsl(180, 20%, 15%)'
        },
        sidebar: {
          DEFAULT: 'hsl(180, 25%, 95%)',
          foreground: 'hsl(180, 5.3%, 26.1%)',
          primary: 'hsl(180, 5.9%, 10%)',
          'primary-foreground': 'hsl(0, 0%, 98%)',
          accent: 'hsl(180, 4.8%, 95.9%)',
          'accent-foreground': 'hsl(180, 5.9%, 10%)',
          border: 'hsl(180, 13%, 91%)',
          ring: 'hsl(175, 80%, 40%)'
        }
      },
      backgroundImage: {
        'gradient-soft': 'linear-gradient(to bottom right, hsl(180, 15%, 95%), hsl(180, 30%, 90%))',
        'gradient-card': 'linear-gradient(to bottom right, hsl(180, 30%, 98%), hsl(180, 25%, 95%))',
        'gradient-accent': 'linear-gradient(135deg, hsl(15, 90%, 65%), hsl(20, 90%, 60%))',
        'gradient-primary': 'linear-gradient(135deg, hsl(175, 80%, 40%), hsl(170, 80%, 35%))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(10px)' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'scale-out': {
          from: { transform: 'scale(1)', opacity: '1' },
          to: { transform: 'scale(0.95)', opacity: '0' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'scale-out': 'scale-out 0.2s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'slide-out': 'slide-out 0.3s ease-out',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'enter': 'fade-in 0.3s ease-out, scale-in 0.2s ease-out',
        'exit': 'fade-out 0.3s ease-out, scale-out 0.2s ease-out',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(8px)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
