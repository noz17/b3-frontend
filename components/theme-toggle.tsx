"use client";

import * as React from "react";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";

import { Switch } from "@/components/ui/switch";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const isDark = resolvedTheme === "dark";

  const handleChange = React.useCallback(
    (checked: boolean) => {
      // Prevent rapid toggling during transition
      if (isTransitioning) return;

      setIsTransitioning(true);

      // Apply transition class for smooth animation
      document.documentElement.classList.add("theme-transition");

      // Add reduced-motion preference check
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Set theme immediately for instant feedback
      setTheme(checked ? "dark" : "light");

      // Use requestAnimationFrame for smoother animation timing
      requestAnimationFrame(() => {
        // Remove transition class after animation completes
        const transitionDuration = prefersReducedMotion ? 0 : 250;

        window.setTimeout(() => {
          document.documentElement.classList.remove("theme-transition");
          setIsTransitioning(false);
        }, transitionDuration);
      });
    },
    [setTheme, isTransitioning]
  );

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur">
        <div className="size-3.5" />
        <Switch
          disabled
          className="h-6 w-11 opacity-50"
          aria-label="Loading theme toggle"
        />
        <div className="size-3.5" />
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur">
      <IconSun
        className={`size-3.5 transition-all duration-300 ${
          isDark
            ? "scale-75 opacity-50"
            : "scale-100 text-amber-500 opacity-100"
        }`}
        aria-hidden="true"
      />
      <Switch
        checked={isDark}
        onCheckedChange={handleChange}
        disabled={isTransitioning}
        aria-label="Toggle theme"
        aria-busy={isTransitioning}
        className="h-6 w-11 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed 
                  data-[state=checked]:bg-emerald-500/90 
                  data-[state=unchecked]:bg-sky-400/90
                  [&_[data-slot=switch-thumb]]:data-[state=checked]:translate-x-5
                  [&_[data-slot=switch-thumb]]:data-[state=unchecked]:translate-x-1
                  [&_[data-slot=switch-thumb]]:transition-transform 
                  [&_[data-slot=switch-thumb]]:duration-300"
      />
      <IconMoonStars
        className={`size-3.5 transition-all duration-300 ${
          isDark
            ? "scale-100 text-indigo-400 opacity-100"
            : "scale-75 opacity-50"
        }`}
        aria-hidden="true"
      />
    </div>
  );
}
