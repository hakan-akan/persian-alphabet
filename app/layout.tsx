import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://dabestan-persian-alphabet.nicepetal14.chatgpt.site'),
  title: 'Dabestan — Learn the Persian Alphabet',
  description: 'Learn all 32 Persian letters through guided lessons, tracing practice, pronunciation, and quick quizzes.',
  openGraph: {
    title: 'Dabestan — Learn the Persian Alphabet',
    description: 'Guided lessons, tracing practice, pronunciation, and quick quizzes for all 32 Persian letters.',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Dabestan — Learn the Persian alphabet' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dabestan — Learn the Persian Alphabet',
    description: 'Guided lessons, tracing practice, pronunciation, and quick quizzes for all 32 Persian letters.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
