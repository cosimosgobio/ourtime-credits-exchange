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
          DEFAULT: 'hsl(270, 80%, 60%)',
          foreground: 'hsl(0, 0%, 100%)'
        },
        accent: {
          DEFAULT: 'hsl(50, 100%, 70%)',
          foreground: 'hsl(0, 0%, 20%)'
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
        ring: 'hsl(270, 80%, 60%)',
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
          primary: 'hsl(270, 80%, 60%)',
          'primary-foreground': 'hsl(0, 0%, 98%)',
          accent: 'hsl(50, 100%, 70%)',
          'accent-foreground': 'hsl(0, 0%, 20%)',
          border: 'hsl(180, 13%, 91%)',
          ring: 'hsl(270, 80%, 60%)'
        }
      },
      backgroundImage: {
        'gradient-soft': 'linear-gradient(to bottom right, hsl(180, 15%, 95%), hsl(180, 30%, 90%))',
        'gradient-card': 'linear-gradient(to bottom right, hsl(180, 30%, 98%), hsl(180, 25%, 95%))',
      }
    }
  },
  plugins: [],
};
