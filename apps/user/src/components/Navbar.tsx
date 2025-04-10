"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Toggle } from "./ui/toggle";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="sticky top-0 w-full h-16 flex items-center justify-between gap-4 border-b px-4 md:px-6 z-10 ">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-16 hidden md:block" />
          <Skeleton className="h-4 w-16 hidden md:block" />
          <Skeleton className="h-4 w-16 hidden md:block" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-48 hidden sm:block" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b ">
      <div className="flex h-16 items-center justify-around px-6">
        <Link href="/" className={`flex items-center font-semibold `}>
          async0
        </Link>

        <nav className="hidden md:flex md:gap-6 md:mx-auto">
          <Link href="/dashboard" className={cn("text-sm ")}>
            Dashboard
          </Link>
          <Link href="/problems" className={cn("text-sm ")}>
            Problems
          </Link>
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <Toggle
            aria-label="Toggle"
            className="cursor-pointer hover:bg-transparent hover:text-foreground data-[state=on]:bg-transparent"
            onPressedChange={() =>
              theme === "light" ? setTheme("dark") : setTheme("light")
            }
          >
            {mounted ? (
              theme === "light" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )
            ) : (
              <div className="h-4 w-4" />
            )}
          </Toggle>

          {isLoggedIn ? (
            <Avatar>
              <AvatarImage
                src="/placeholder.svg?height=32&width=32"
                alt="User"
              />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="cursor-pointer">
                Sign In
              </Button>
              <Button size="sm" className="cursor-pointer">
                Sign Up
              </Button>
            </div>
          )}

          <Button
            className="items-center justify-center rounded-md md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="container pb-4 md:hidden">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/problems"
              className={cn(
                "text-sm font-medium transition-colors hover:text-dark/70 dark:hover:text-light/70",
                pathname === "/problems"
                  ? "text-dark dark:text-light"
                  : "text-dark/60 dark:text-light/60"
              )}
            >
              Problems
            </Link>
            <Link
              href="/leaderboard"
              className={cn(
                "text-sm font-medium transition-colors hover:text-dark/70 dark:hover:text-light/70",
                pathname === "/leaderboard"
                  ? "text-dark dark:text-light"
                  : "text-dark/60 dark:text-light/60"
              )}
            >
              Leaderboard
            </Link>
            <Link
              href="/discuss"
              className={cn(
                "text-sm font-medium transition-colors hover:text-dark/70 dark:hover:text-light/70",
                pathname === "/discuss"
                  ? "text-dark dark:text-light"
                  : "text-dark/60 dark:text-light/60"
              )}
            >
              Discuss
            </Link>
            <Link
              href="/login"
              className={cn(
                "text-sm font-medium transition-colors hover:text-dark/70 dark:hover:text-light/70",
                pathname === "/login"
                  ? "text-dark dark:text-light"
                  : "text-dark/60 dark:text-light/60"
              )}
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
