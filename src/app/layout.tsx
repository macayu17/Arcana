import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Serif } from "next/font/google";
import { AppFrame } from "@/components/layout/app-frame";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const editorialSerif = IBM_Plex_Serif({
  variable: "--font-editorial-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://arcana-study.vercel.app",
  ),
  title: {
    default: "Arcana | Interview Study Platform",
    template: "%s | Arcana",
  },
  description:
    "Ayush's project study platform with architecture diagrams, concept explainers, interview Q&A, flashcards, and progress tracking.",
  openGraph: {
    title: "Arcana | Interview Study Platform",
    description:
      "Project deep dives, concepts, architecture notes, interview Q&A, flashcards, and study progress.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${editorialSerif.variable} h-full antialiased dark`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{localStorage.setItem('arcana-theme','dark');document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}catch(e){document.documentElement.classList.add('dark');}`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <AppFrame>{children}</AppFrame>
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}
