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
      <body className={`${inter.className} antialiased`}>{children}
              <Toaster position="top-right" ></Toaster>
      </body>
    </html>
  );
}
