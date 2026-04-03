import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Nima's Dashboard",
  description: 'Personal developer start page',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
