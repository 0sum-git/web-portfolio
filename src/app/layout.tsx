import type { Metadata } from 'next';
import './globals.css';
import Navigation from '../components/Navigation';
import { ThemeProvider } from '../components/ThemeProvider';

export const metadata: Metadata = {
  title: 'rodrigo ribeiro | portfolio',
  description: 'cybersecurity and web/software developer',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('theme')
                if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen font-mono">
        <ThemeProvider>
          <Navigation />
          <div className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
