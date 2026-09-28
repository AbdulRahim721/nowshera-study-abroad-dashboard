import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title:'CopyDownload Staff Dashboard', description:'Nowshera Study Abroad Consultants' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
