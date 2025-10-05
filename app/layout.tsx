import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Fira_Code } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth"
import { Toaster } from "@/components/toaster"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
})

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
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
    <html lang="en" className={`${montserrat.variable} ${firaCode.variable}`}>
      <head>
        <style>{`
html {
  font-family: ${montserrat.style.fontFamily};
}
        `}</style>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
