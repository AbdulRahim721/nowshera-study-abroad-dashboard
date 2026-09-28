import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { ink: '#102a43', teal: '#0f766e', cream: '#f7f9f7' }, boxShadow: { soft: '0 12px 35px rgba(16,42,67,.07)' } } }, plugins: [] };
export default config;
