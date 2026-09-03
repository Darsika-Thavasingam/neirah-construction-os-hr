import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ToastContainer } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: {
    template: '%s | Neirah HR',
    default: 'Neirah Construction OS — HR Management',
  },
  description: 'Neirah Construction OS — Enterprise HR & Payroll Platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <div className="app-layout">
          <Sidebar />
          <div className="main-wrapper">
            <Header />
            <main className="page-container">
              {children}
            </main>
          </div>
        </div>
        <ToastContainer />
      </body>
    </html>
  );
}
