import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FishRouter',
  description: 'Fish Audio to Verity Mod TTS Bridge',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: '2rem', backgroundColor: '#0f172a', color: '#f8fafc' }}>
        {children}
      </body>
    </html>
  );
}
