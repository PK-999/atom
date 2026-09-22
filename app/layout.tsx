import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { WebVitals } from "@/components/observability/WebVitals";

import "./globals.css";

const themeBootstrapScript = `(function(){var mode="system";try{var stored=localStorage.getItem("atom:preferences:v1:theme");if(stored==="light"||stored==="dark"||stored==="system")mode=stored}catch(error){}var prefersDark=typeof matchMedia==="function"&&matchMedia("(prefers-color-scheme: dark)").matches;var resolved=mode==="dark"||(mode==="system"&&prefersDark)?"dark":"light";document.documentElement.dataset.theme=resolved;document.documentElement.style.colorScheme=resolved})()`;

export const metadata: Metadata = {
  title: {
    default: "ATOM — Understand energy through evidence",
    template: "%s | ATOM",
  },
  description:
    "An evidence-first interactive energy-literacy platform centered on nuclear energy and the wider electricity system.",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
          data-theme-bootstrap
        />
      </head>
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  );
}
