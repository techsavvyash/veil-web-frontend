import type React from "react"
import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import { Instrument_Serif } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth"
import { Toaster } from "@/components/toaster"

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-instrument-serif",
})

export const metadata: Metadata = {
  title: "Veil - API Marketplace",
  description: "Buy and sell APIs with ease",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${figtree.variable} ${instrumentSerif.variable}`}>
      <head>
        <style>{`
html {
  font-family: ${figtree.style.fontFamily};
}
        `}</style>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
