import '@/app/(features)/_shared/styles/global.css';

import { inter } from '@/app/(features)/_shared/fonts';
import { Toaster } from 'sonner';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Toaster position="top-right" ></Toaster>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
