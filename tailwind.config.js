/** @type {import('tailwindcss').Config} */

// Rebranding racoelho — tokens (ver src/app/globals.css). As cores apontam para variáveis CSS.
const v = (name) => `var(--rc-${name})`;

const rcTheme = {
  colors: {
    rc: {
      canvas: v('canvas'),
      bg: v('bg'),
      'bg-admin': v('bg-admin'),
      surface: v('surface'),
      'surface-2': v('surface-2'),
      'surface-3': v('surface-3'),
      sunken: v('surface-sunken'),
      ad: v('ad'),
      tag: v('tag'),
      input: v('input'),
      badge: v('badge'),
      footer: v('footer'),
      'nav-hover': v('nav-hover'),
      'nav-ink': v('nav-ink'),
      'logo-ink': v('logo-ink'),
      border: v('border'),
      'border-card': v('border-card'),
      'border-hover': v('border-hover'),
      'border-strong': v('border-strong'),
      'border-chip': v('border-chip'),
      ink: v('ink'),
      'ink-2': v('ink-2'),
      'ink-3': v('ink-3'),
      'ink-4': v('ink-4'),
      'ink-5': v('ink-5'),
      'ink-6': v('ink-6'),
      'ink-empty': v('ink-empty'),
      blue: {
        DEFAULT: v('blue'), hover: v('blue-hover'), link: v('blue-link'), soft: v('blue-soft'),
        surface: v('blue-surface'), border: v('blue-border'), chip: v('blue-chip'), logo: v('blue-logo'),
      },
      green: {
        DEFAULT: v('green'), hover: v('green-hover'), surface: v('green-surface'),
        border: v('green-border'), 'border-strong': v('green-border-strong'), track: v('green-track'), num: v('green-num'),
      },
      amber: {
        DEFAULT: v('amber'), hover: v('amber-hover'), surface: v('amber-surface'), 'surface-2': v('amber-surface-2'),
        border: v('amber-border'), 'border-soft': v('amber-border-soft'), num: v('amber-num'),
      },
      red: v('red'),
    },
  },
  fontSize: {
    // [tamanho, { lineHeight, letterSpacing }]
    'rc-hero': ['60px', { lineHeight: '1.05', letterSpacing: '-.04em' }],
    'rc-h1': ['44px', { lineHeight: '1.1', letterSpacing: '-.035em' }],
    'rc-h1-article': ['46px', { lineHeight: '1.12', letterSpacing: '-.035em' }],
    'rc-h2-article': ['28px', { lineHeight: '1.25', letterSpacing: '-.025em' }],
    'rc-h2-card': ['27px', { lineHeight: '1.2', letterSpacing: '-.025em' }],
    'rc-h2': ['22px', { lineHeight: '1.3', letterSpacing: '-.02em' }],
    'rc-card-title': ['18px', { lineHeight: '1.32', letterSpacing: '-.018em' }],
    'rc-lead': ['19.5px', { lineHeight: '1.65' }],
    'rc-article': ['18px', { lineHeight: '1.78' }],
    'rc-body': ['15.5px', { lineHeight: '1.6' }],
    'rc-small': ['14px', { lineHeight: '1.55' }],
    'rc-meta': ['11.5px', { lineHeight: '1.5' }],
    'rc-eyebrow': ['10.5px', { lineHeight: '1.4', letterSpacing: '.12em' }],
    // mobile
    'rc-hero-m': ['36px', { lineHeight: '1.08', letterSpacing: '-.035em' }],
    'rc-h1-m': ['30px', { lineHeight: '1.15', letterSpacing: '-.032em' }],
    'rc-h1-article-m': ['31px', { lineHeight: '1.15', letterSpacing: '-.035em' }],
    'rc-h2-m': ['18px', { lineHeight: '1.3', letterSpacing: '-.02em' }],
    'rc-article-m': ['16.5px', { lineHeight: '1.78' }],
  },
  borderRadius: {
    'rc-chip': v('r-chip'),
    'rc-control': v('r-control'),
    'rc-card': v('r-card'),
    'rc-card-lg': v('r-card-lg'),
  },
  boxShadow: {
    'rc-primary': v('shadow-primary'),
  },
  backgroundImage: {
    'rc-dots': v('dots'),
    'rc-dots-fade': v('dots-fade'),
    'rc-placeholder': v('placeholder'),
  },
  backgroundSize: {
    'rc-dots': '22px 22px',
    'rc-dots-m': '20px 20px',
  },
  maxWidth: {
    'rc-container': '1180px',
  },
  animation: {
    'rc-pulse': 'rc-pulse-dot 2.4s ease-in-out infinite',
    'rc-shimmer': 'rc-shimmer 1.4s ease-in-out infinite',
  },
};

module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        project: "hsl(var(--color-project) / <alpha-value>)",
        ...rcTheme.colors,
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      fontSize: rcTheme.fontSize,
      boxShadow: rcTheme.boxShadow,
      backgroundImage: rcTheme.backgroundImage,
      backgroundSize: rcTheme.backgroundSize,
      maxWidth: rcTheme.maxWidth,
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        ...rcTheme.borderRadius,
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        ...rcTheme.animation,
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} 