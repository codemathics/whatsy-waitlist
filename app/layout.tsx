import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Whatsy – Your conversations, handled.",
  icons: { icon: "/favicon.svg" },
  description:
    "Whatsy helps you chat with your contacts when you are unavailable in a way that feels human, personal, and true to you. Private by design, everything runs securely on your local machine.",
  openGraph: {
    title: "Whatsy – Your conversations, handled.",
    description:
      "An autonomous WhatsApp agent that replies as you using a local LLM. No data ever leaves your machine.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clarityProjectId = process.env.NEXT_PUBLIC_MICROSOFT_CLARITY_ID;

  return (
    <html lang="en" className={nunito.variable}>
      <body className="min-h-screen bg-white">
        {children}
        {clarityProjectId ? (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityProjectId}");
            `}
          </Script>
        ) : null}
      </body>
    </html>
  );
}
