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

export type ProvidersResponse = Record<
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
        <div className="ml-auto">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
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
                <Button key={idx} onClick={() => signIn(provider.id)}>
                  <LogIn size="16" className="mr-2" />
                  Sign up
                </Button>
              );
            })
          )}
        </div>
      </header>
    </>
  );
}
