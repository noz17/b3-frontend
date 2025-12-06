"use client"

import * as React from "react"
import { useTheme, ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

function ThemeTransitionEffect() {
  const { resolvedTheme } = useTheme()

  React.useEffect(() => {
    if (typeof document === "undefined") return
    const root = document.documentElement
    root.classList.add("theme-transition")
    const timer = window.setTimeout(() => {
      root.classList.remove("theme-transition")
    }, 250)
    return () => window.clearTimeout(timer)
  }, [resolvedTheme])

  return null
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      {...props}
    >
      <ThemeTransitionEffect />
      {children}
    </NextThemesProvider>
  )
}
