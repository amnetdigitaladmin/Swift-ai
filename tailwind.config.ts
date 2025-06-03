
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
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'sans': ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
				'poppins': ['Poppins', 'sans-serif'],
			},
			fontSize: {
				'xs': '0.625rem',    // 10px (was 12px)
				'sm': '0.75rem',     // 12px (was 14px)
				'base': '0.875rem',  // 14px (was 16px)
				'lg': '1rem',        // 16px (was 18px)
				'xl': '1.125rem',    // 18px (was 20px)
				'2xl': '1.375rem',   // 22px (was 24px)
				'3xl': '1.75rem',    // 28px (was 30px)
				'4xl': '2rem',       // 32px (was 36px)
				'5xl': '2.75rem',    // 44px (was 48px)
				'6xl': '3.5rem',     // 56px (was 60px)
				'7xl': '4.25rem',    // 68px (was 72px)
				'8xl': '5.75rem',    // 92px (was 96px)
				'9xl': '7.5rem',     // 120px (was 128px)
			},
			colors: {
				 gradient: {
					background: {
						from: 'hsl(var(--gradient-background-from))',
						to: 'hsl(var(--gradient-background-to))',
						'hover-from': 'hsl(var(--gradient-background-hover-from))',
						'hover-to': 'hsl(var(--gradient-background-hover-to))',
						}
				},
				custom: {
					bg: 'hsl(var(--custom-bg))',
					nav_bg:'hsl(var(--custom-nav-bg))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
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
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
