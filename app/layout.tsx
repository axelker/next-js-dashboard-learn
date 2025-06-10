import '@/app/global.css';

import { inter } from '@/app/fonts/fonts';
import { Toaster } from 'sonner';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: "Dashboard Next JS",
  description:"A modern web app for user authentication, dashboard access, and GitHub login using Next.js.",
  keywords:["Next.js", "authentication", "Better Auth", "GitHub login", "dashboard", "user login", "secure access", "OAuth, web app"],
  openGraph: {
    title: "Modern Dashboard App",
    description:"A secure and responsive dashboard built with Next.js, featuring user authentication and GitHub/Google login.",
    images:"/opengraph.png"
  },
  icons:"/favicon.ico"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/** SAME TO METADATA NEXT API */}

      {/* <title>Dashboard Next JS</title> */}
      {/**Description Metadata: 
       * This metadata provides a brief overview of the webpage content and is often displayed in search engine results.
      */}
      {/* <meta name="description" content="A modern web app for user authentication, dashboard access, and GitHub login using Next.js." /> */}
        
      {/**Keyword Metadata: 
       * This metadata provides a brief overview of the webpage content and is often displayed in search engine results.
      */}
      {/* <meta name="keywords" content="Next.js, authentication, Better Auth, GitHub login, dashboard, user login, secure access, OAuth, web app" /> */}
      {/**Open Graph Metadata: 
       This metadata enhances the way a webpage is represented when shared on social media platforms,
        providing information such as the title, description, and preview image. 
      */}
      {/* <meta property="og:title" content="Modern Dashboard App" />
      <meta property="og:description" content="A secure and responsive dashboard built with Next.js, featuring user authentication and GitHub/Google login." />
      <meta property="og:image" content="/opengraph.png" />
      <link rel="icon" href="/favicon.ico" /> */}

      
      <body className={`${inter.className} antialiased`}>{children}
              <Toaster position="top-right" ></Toaster>
      </body>
    </html>
  );
}
