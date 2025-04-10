"use client";

import * as React from "react";
import Link from "next/link";
import { MoonIcon, SearchIcon, SunIcon, User } from "lucide-react";
import { useTheme } from "next-themes";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "./ui/sidebar";

export function ProblemNavbar() {
  const { theme, setTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);

  return (
    <div className="p-4 flex items-center ">
      <SidebarTrigger className="md:hidden cursor-pointer" />
      <Link
        href="/"
        className="ml-3 md:ml-16 text-lg font-semibold transition-colors hover:text-primary"
      >
        async0
      </Link>

      <div className="flex items-center gap-4 ml-auto mr-4">
        <div className="relative hidden md:block">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-[200px] pl-8 md:w-[250px] lg:w-[300px]"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {isLoggedIn ? (
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={toggleLogin}>
              Sign In
            </Button>
            <Button size="sm" onClick={toggleLogin}>
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
