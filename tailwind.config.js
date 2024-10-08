/** @type {import('tailwindcss').Config} */

module.exports = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}'
    ],
    safelist: [ // 避免因為 tailwind 無法在 dom 上找到相關 class 就把這些 class 刪除 , 以確保動態 class 可以被正確的套用
        {
            pattern: /(bg|text|border)-(warning|error|success)/
        }
    ],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                sm: '320px',
                md: '768px',
                lg: '1024px'
            }
        },
        extend: {
            colors: {
                transparent: 'transparent',
                current: 'currentColor',
                warning: {
                    DEFAULT: 'var(--warning)',
                    foreground: 'var(--warning-foreground)',
                    secondary: 'var(--warning-secondary)',
                    'secondary-foreground': 'var(--warning-secondary-foreground)'
                },
                error: {
                    DEFAULT: 'var(--error)',
                    foreground: 'var(--error-foreground)',
                    secondary: 'var(--error-secondary)',
                    'secondary-foreground': 'var(--error-secondary-foreground)'
                },
                success: {
                    DEFAULT: 'var(--success)',
                    foreground: 'var(--success-foreground)',
                    secondary: 'var(--success-secondary)',
                    'secondary-foreground': 'var(--success-secondary-foreground)'
                },
                border: 'var(--border)',
                input: 'var(--input)',
                ring: 'var(--ring)',
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                overlay: 'var(--overlay)',
                disabled: {
                    DEFAULT: 'var(--disabled)',
                    foreground: 'var(--disabled-foreground)'
                },
                confirm: {
                    DEFAULT: 'var(--confirm)',
                    foreground: 'var(--confirm-foreground)'
                },
                header: {
                    DEFAULT: 'var(--header)',
                    foreground: 'var(--header-foreground)'
                },
                primary: {
                    DEFAULT: 'var(--primary)',
                    foreground: 'var(--primary-foreground)'
                },
                secondary: {
                    DEFAULT: 'var(--secondary)',
                    foreground: 'var(--secondary-foreground)'
                },
                destructive: {
                    DEFAULT: 'var(--destructive)',
                    foreground: 'var(--destructive-foreground)'
                },
                muted: {
                    DEFAULT: 'var(--muted)',
                    foreground: 'var(--muted-foreground)'
                },
                accent: {
                    DEFAULT: 'var(--accent)',
                    foreground: 'var(--accent-foreground)'
                },
                popover: {
                    DEFAULT: 'var(--popover)',
                    foreground: 'var(--popover-foreground)'
                },
                card: {
                    DEFAULT: 'var(--card)',
                    foreground: 'var(--card-foreground)',
                    overlay: 'var(--card-overlay)'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out'
            }
        }
    },
    plugins: [require('tailwindcss-animate')]
}
