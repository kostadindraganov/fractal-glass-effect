import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fractal Glass Parallax Effect',
  description: 'Fractal Glass Parallax Effect built with Next.js, Three.js, and GSAP',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
