import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'oklch(var(--border))',
        input: 'oklch(var(--input))',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        background: 'oklch(var(--background))',
        foreground: 'oklch(var(--foreground))',
        primary: {
          DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
          foreground: 'oklch(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
          foreground: 'oklch(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
          foreground: 'oklch(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
          foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
        },
        accent: {
          DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
          foreground: 'oklch(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'oklch(var(--popover))',
          foreground: 'oklch(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'oklch(var(--card))',
          foreground: 'oklch(var(--card-foreground))'
        },
        chart: {
          1: 'oklch(var(--chart-1))',
          2: 'oklch(var(--chart-2))',
          3: 'oklch(var(--chart-3))',
          4: 'oklch(var(--chart-4))',
          5: 'oklch(var(--chart-5))'
        },
        sidebar: {
          DEFAULT: 'oklch(var(--sidebar))',
          foreground: 'oklch(var(--sidebar-foreground))',
          primary: 'oklch(var(--sidebar-primary))',
          'primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
          accent: 'oklch(var(--sidebar-accent))',
          'accent-foreground': 'oklch(var(--sidebar-accent-foreground))',
          border: 'oklch(var(--sidebar-border))',
          ring: 'oklch(var(--sidebar-ring))'
        },
        // Indian theme colors
        saffron: {
          50: '#fff8f0',
          100: '#ffedd5',
          200: '#ffd9a8',
          300: '#ffbf70',
          400: '#ff9933',
          500: '#e67300',
          600: '#cc5500',
          700: '#a33d00',
          800: '#7a2d00',
          900: '#521e00',
        },
        terracotta: {
          50: '#fdf4f0',
          100: '#fae5db',
          200: '#f5c9b5',
          300: '#eda485',
          400: '#e07050',
          500: '#d2691e',
          600: '#b85518',
          700: '#944213',
          800: '#6e310e',
          900: '#4a2009',
        },
        cream: {
          50: '#fffef8',
          100: '#fffcf0',
          200: '#fff8dc',
          300: '#fff0b8',
          400: '#ffe48a',
          500: '#ffd55a',
          600: '#e6b830',
          700: '#c49a18',
          800: '#9a7810',
          900: '#6e5508',
        },
        india: {
          green: '#138808',
          white: '#FFFFFF',
          saffron: '#FF9933',
          navy: '#000080',
        }
      },
      fontFamily: {
        game: ['Baloo 2', 'cursive'],
        body: ['Rajdhani', 'sans-serif'],
        hindi: ['Tiro Devanagari Hindi', 'serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0,0,0,0.05)',
        saffron: '0 4px 20px rgba(255, 153, 51, 0.4)',
        'saffron-lg': '0 8px 40px rgba(255, 153, 51, 0.5)',
        game: '0 0 30px rgba(255, 153, 51, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'mandala-tile': "url('/assets/generated/mandala-border.dim_256x256.png')",
        'saffron-gradient': 'linear-gradient(135deg, #ff9933, #e67300)',
        'india-gradient': 'linear-gradient(180deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)',
        'sunset-gradient': 'linear-gradient(180deg, #ff6b35 0%, #f7931e 30%, #ffcd3c 60%, #87ceeb 100%)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'flash': {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' }
        },
        'pulse-saffron': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(255, 153, 51, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 153, 51, 0.8)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'flash': 'flash 0.3s ease-in-out',
        'pulse-saffron': 'pulse-saffron 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
      }
    }
  },
  plugins: [typography, containerQueries, animate]
};
