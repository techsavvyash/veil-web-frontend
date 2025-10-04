"use client"

import { Toaster as SonnerToaster } from "sonner"
import { useEffect, useState } from "react"

export function Toaster() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    console.log("Toaster component mounted")
  }, [])

  if (!mounted) return null

  return <SonnerToaster theme="dark" position="bottom-right" />
}
