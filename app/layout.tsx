import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'CardioGuard — CVD Risk Prediction Platform',
  description: 'AI-powered cardiovascular disease risk prediction. Get personalized insights and track your heart health with evidence-based analysis.',
  keywords: 'cardiovascular disease, CVD prediction, heart health, risk assessment, AI health',
  openGraph: {
    title: 'CardioGuard — CVD Risk Prediction Platform',
    description: 'AI-powered cardiovascular disease risk prediction platform.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans dark-transition`}>
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'hot-toast',
              style: {
                borderRadius: '1rem',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
              },
              success: {
                iconTheme: { primary: '#1b6d24', secondary: '#a0f399' },
              },
              error: {
                iconTheme: { primary: '#b7181f', secondary: '#ffdad6' },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
