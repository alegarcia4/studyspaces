// study-spot-social-main/tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"], // Tells Tailwind to look for the .dark class
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
                studyspot: {
                    purple: "#6E59A5",
                    'light-purple': "#9B87F5",
                    'soft-purple': "#E5DEFF",
                    midnight: "#1A1F2C",
                    neutral: "#8E9196",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
                "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
                "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
                "caret-blink": { "0%,70%,100%": { opacity: "1" }, "20%,50%": { opacity: "0" } },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.3s ease-out",
                "caret-blink": "caret-blink 1.25s ease-out infinite",
            },
            typography: ({ theme }: { theme: any }) => ({
                DEFAULT: { /* ... light mode prose ... */ },
                invert: { // Dark mode styles override
                    css: {
                        '--tw-prose-body': 'hsl(var(--foreground) / 0.9)', // Use adjusted foreground for body
                        '--tw-prose-headings': 'hsl(var(--foreground))',
                        '--tw-prose-lead': 'hsl(var(--muted-foreground))',
                        '--tw-prose-links': 'hsl(var(--primary))',
                        '--tw-prose-bold': 'hsl(var(--foreground))',
                        '--tw-prose-counters': 'hsl(var(--muted-foreground))',
                        '--tw-prose-bullets': 'hsl(var(--border))',
                        '--tw-prose-hr': 'hsl(var(--border))',
                        '--tw-prose-quotes': 'hsl(var(--muted-foreground))',
                        '--tw-prose-quote-borders': 'hsl(var(--border))',
                        '--tw-prose-captions': 'hsl(var(--muted-foreground))',
                        '--tw-prose-code': 'hsl(var(--accent-foreground))',
                        '--tw-prose-pre-code': 'hsl(var(--secondary-foreground))',
                        '--tw-prose-pre-bg': 'hsl(var(--secondary))',
                        '--tw-prose-th-borders': 'hsl(var(--border))',
                        '--tw-prose-td-borders': 'hsl(var(--border))',
                         // Explicit heading colors for clarity
                        h1: { color: 'hsl(var(--foreground))' },
                        h2: { color: 'hsl(var(--foreground))' },
                        h3: { color: 'hsl(var(--foreground))' },
                        h4: { color: 'hsl(var(--foreground))' },
                        h5: { color: 'hsl(var(--foreground))' },
                        h6: { color: 'hsl(var(--foreground))' },
                        // Ensure links inherit correctly
                        a: { color: 'hsl(var(--primary))'},
                        strong: { color: 'hsl(var(--foreground))' },
                        code: { color: 'hsl(var(--accent-foreground))', backgroundColor: 'hsl(var(--accent) / 0.1)', padding: '0.2em 0.4em', borderRadius: '0.25rem', fontSize: '0.9em'},
                        blockquote: { color: 'hsl(var(--muted-foreground))', borderLeftColor: 'hsl(var(--border))' },
                    },
                },
            }),
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        require("@tailwindcss/typography")
    ],
} satisfies Config;