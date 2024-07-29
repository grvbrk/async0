"use client";
import {
  signIn,
  signOut,
  useSession,
  getProviders,
  ClientSafeProvider,
  LiteralUnion,
} from "next-auth/react";
import { useEffect, useState } from "react";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";

import Link from "next/link";
import { Loader2, LogIn, Search } from "lucide-react";
import { BuiltInProviderType } from "next-auth/providers/index";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { usePathname } from "next/navigation";
import Sidebar from "../problems/_components/Sidebar";
import { useTheme } from "next-themes";
import { Switch } from "@repo/ui/components/ui/switch";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { useDebounce } from "../hooks/useDebounce";
import { MAX_QUERY_LENGTH } from "@/lib/utils";
import { toast } from "sonner";
import { searchProblemQuery } from "../actions/search";
import SearchDisplay from "./SearchDisplay";

type ProvidersResponse = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
>;

export default function Navbar() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [providers, setProviders] = useState<ProvidersResponse | null>(null);
  const [mounted, setMounted] = useState(false);
  const [auth0Authenticated, setAuth0Authenticated] = useState(false);
  const [text, setText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const debouncedText = useDebounce(text, 0.5);
  const [showCard, setShowCard] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      if (debouncedText.length >= 0) {
        try {
          const results = await searchProblemQuery(debouncedText);
          setSearchResults(results as any[]);
        } catch (error) {
          console.error("Error searching problems:", error);
        }
      }
      try {
        const response = await getProviders();
        setProviders(response);
      } catch (error) {
        console.error("Error getting providers:", error);
      }

      setMounted(true);
    }

    fetchData();
  }, [debouncedText]);

  if (!mounted || status === "loading")
    return (
      <div className="sticky top-0 w-full h-16 flex items-center justify-between gap-4 border-b px-4 md:px-6 z-10 bg-background">
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

  return (
    <>
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b  px-4 md:px-6 z-10">
        <nav className="pl-2 md:pl-4 flex-col gap-8 text-sm md:flex md:flex-row md:items-center md:gap-10 md:text-sm lg:gap-16">
          {pathname != "/" && (
            <Link
              href="#"
              className="hidden md:block md:font-bold md:transition-colors md:hover:text-primary md:text-muted-foreground"
            >
              <Sidebar />
            </Link>
          )}

          <Link
            href="/"
            className={` md:block font-black text-foreground transition-colors hover:text-primary ${pathname === "/" && "text-primary"}`}
          >
            Async0
          </Link>

          <Link
            href="/problems"
            className={`hidden md:block text-muted-foreground transition-colors hover:text-primary ${pathname === "/problems" && "text-primary"}`}
          >
            Problems
          </Link>

          <Link
            href="/neetcode"
            className={`hidden md:block text-muted-foreground transition-colors hover:text-primary ${pathname === "/neetcode" && " text-primary"}`}
          >
            Neetcode
          </Link>
        </nav>
        <div className="ml-auto flex-1 sm:flex-initial relative">
          <div
            className="relative"
            onFocus={() => setShowCard(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                const isLinkClick =
                  e.relatedTarget && e.relatedTarget.tagName === "A";
                if (!isLinkClick) {
                  setShowCard(false);
                } else {
                  setTimeout(() => {
                    setShowCard(false);
                  }, 100);
                }
              }
            }}
          >
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search problem..."
              className="pl-8 sm:w-[400px] md:w-[300px] lg:w-[450px]"
              onChange={(e) => {
                let text = e.target.value;
                setShowCard(text.length > 0);
                if (text.length >= MAX_QUERY_LENGTH) {
                  e.target.value = e.target.value.slice(0, MAX_QUERY_LENGTH);
                  toast.error("Max query length reached");
                } else {
                  setText(text);
                }
              }}
            />
          </div>
          {showCard && (
            <div className="absolute mt-3 w-full sm:w-[400px] md:w-[300px] lg:w-[450px]">
              <SearchDisplay searchResults={searchResults} />
            </div>
          )}
        </div>

        <Switch
          id="toggleMode"
          checked={theme === "dark"}
          onCheckedChange={() =>
            theme === "light" ? setTheme("dark") : setTheme("light")
          }
        />

        {auth0Authenticated ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </Button>
        ) : session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 cursor-pointer">
                <AvatarImage src={session.user?.image!} alt="pfp" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{session.user?.name}</DropdownMenuLabel>
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
                onClick={() => {
                  setAuth0Authenticated(true);
                  signIn(provider.id);
                }}
              >
                <LogIn size="16" className="mr-2" />
                Sign in
              </Button>
            );
          })
        )}
      </header>
    </>
  );
}
