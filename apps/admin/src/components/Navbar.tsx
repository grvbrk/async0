"use client";

import {
  signIn,
  signOut,
  getProviders,
  useSession,
  ClientSafeProvider,
  LiteralUnion,
} from "next-auth/react";
import Link from "next/link";
import { CircleUser, LogIn, Search } from "lucide-react";
import { BuiltInProviderType } from "next-auth/providers/index";
import { useState, useEffect } from "react";
import { Button } from "@repo/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@repo/ui/components/ui/dropdown-menu";
import { Input } from "@repo/ui/components/ui/input";

type ProvidersResponse = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
>;

export default function Navbar() {
  const { data: session } = useSession();
  const [providers, setProviders] = useState<ProvidersResponse | null>(null);

  useEffect(() => {
    async function setAuthProviders() {
      const response = (await getProviders()) as ProvidersResponse;
      setProviders(response);
    }

    setAuthProviders();
  }, []);

  return (
    <>
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-10 md:text-sm lg:gap-16">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/problems"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Problems
          </Link>
          <Link
            href="/users"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Users
          </Link>
        </nav>
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search problem..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          providers &&
          Object.values(providers).map((provider, idx) => {
            return (
              <Button
                key={idx}
                onClick={() =>
                  signIn(provider.id, {
                    callbackUrl: "http://localhost:3001",
                    redirect: false,
                  })
                }
              >
                <LogIn size="16" className="mr-2" />
                Sign up
              </Button>
            );
          })
        )}
      </header>
    </>
  );
}
