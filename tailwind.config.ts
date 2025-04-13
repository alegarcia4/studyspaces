// study-spot-social-main/tailwind.config.ts
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
            padding: "1.5rem",
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
                sidebar: {
                    DEFAULT: 'hsl(var(--sidebar-background))',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: 'hsl(var(--sidebar-primary))',
                    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))'
                },
                studyspot: {
                    purple: "#6E59A5",
                    'light-purple': "#9B87F5",
                    'soft-purple': "#E5DEFF",
                    midnight: "#1A1F2C",
                    neutral: "#8E9196",
                },
                'space-dark': 'hsl(225 25% 6%)',
                'space-medium': 'hsl(225 20% 9%)',
                'space-light': 'hsl(217 15% 22%)',
                'space-accent': 'hsl(260 75% 70%)',
                'space-text': 'hsl(215 20% 88%)',
                'space-subtle-text': 'hsl(215 15% 55%)',
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" }
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" }
                },
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" }
                },
                "caret-blink": {
                    "0%,70%,100%": { opacity: "1" },
                    "20%,50%": { opacity: "0" }
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.3s ease-out",
                "caret-blink": "caret-blink 1.25s ease-out infinite",
            },
            typography: ({ theme }: { theme: any }) => ({
                DEFAULT: {
                    css: {
                        '--tw-prose-body': theme('colors.space-text'),
                        '--tw-prose-headings': theme('colors.space-text'),
                        '--tw-prose-lead': theme('colors.space-subtle-text'),
                        '--tw-prose-links': theme('colors.primary.DEFAULT'),
                        '--tw-prose-bold': theme('colors.space-text'),
                        '--tw-prose-counters': theme('colors.space-subtle-text'),
                        '--tw-prose-bullets': theme('colors.border'),
                        '--tw-prose-hr': theme('colors.border'),
                        '--tw-prose-quotes': theme('colors.space-text'),
                        '--tw-prose-quote-borders': theme('colors.border'),
                        '--tw-prose-captions': theme('colors.space-subtle-text'),
                        '--tw-prose-code': theme('colors.space-text'),
                        '--tw-prose-pre-code': theme('colors.space-text'),
                        '--tw-prose-pre-bg': theme('colors.space-medium'),
                        '--tw-prose-th-borders': theme('colors.border'),
                        '--tw-prose-td-borders': theme('colors.border'),
                    },
                },
            }),
        },
    },
    plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;