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
import { Loader2, LogIn } from "lucide-react";
import { BuiltInProviderType } from "next-auth/providers/index";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { useTheme } from "next-themes";
import { Switch } from "@repo/ui/components/ui/switch";
import { Skeleton } from "@repo/ui/components/ui/skeleton";

import Searchbar from "./Searchbar";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@repo/ui/components/ui/popover";
import {
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Command,
} from "@repo/ui/components/ui/command";

type ProvidersResponse = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
>;

type Status = {
  value: string;
  label: string;
};

const statuses: Status[] = [
  {
    value: "home",
    label: "Home",
  },
  {
    value: "problems",
    label: "Problems",
  },
  {
    value: "neetcode",
    label: "Neetcode",
  },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [providers, setProviders] = useState<ProvidersResponse | null>(null);
  const [auth0Authenticated, setAuth0Authenticated] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getProviders();
        setProviders(response);
      } catch (error) {
        console.error("Error getting providers:", error);
      }
    }

    fetchData();
  }, []);

  if (status === "loading")
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
      <header className="sticky top-0 flex h-16 items-center border-b px-4 md:px-6 md:gap-4 z-10 bg-background">
        <div className="flex items-center pl-1 text-sm md:px-4 md:flex md:flex-row md:items-center md:gap-8 lg:gap-12">
          <Link
            href="#"
            className="font-bold transition-colors hover:text-primary text-muted-foreground"
          >
            <Sidebar />
          </Link>

          <div className="md:hidden">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className=" justify-start hover:bg-transparent"
                >
                  {selectedStatus ? (
                    <p className="line-clamp-1 text-muted-foreground">
                      {selectedStatus.label}
                    </p>
                  ) : (
                    <p className="capitalize line-clamp-1 text-muted-foreground">
                      {pathname.startsWith("/problems")
                        ? "Problems"
                        : pathname.startsWith("/neetcode")
                          ? "Neetcode"
                          : "Home"}
                    </p>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[100px] p-0" align="start">
                <StatusList
                  setOpen={setOpen}
                  setSelectedStatus={setSelectedStatus}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Link
            href="/"
            className={`hidden md:block font-black text-foreground transition-colors hover:text-primary ${pathname === "/" && "text-primary"}`}
          >
            Λsync0
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
        </div>

        <div className="flex items-center gap-4 w-full">
          <div className="w-full lg:w-[450px] lg:ml-auto">
            <Searchbar />
          </div>
          <div className="flex items-center gap-4">
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
                    <LogIn size="16" className="hidden md:block mr-2" />
                    Sign in
                  </Button>
                );
              })
            )}
          </div>
        </div>
      </header>
    </>
  );
}

function StatusList({
  setOpen,
  setSelectedStatus,
}: {
  setOpen: (open: boolean) => void;
  setSelectedStatus: (status: Status | null) => void;
}) {
  return (
    <Command>
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {statuses.map((status) => (
            <Link
              key={status.value}
              href={
                status.value === "home"
                  ? "/"
                  : status.value === "problems"
                    ? "/problems"
                    : "/neetcode"
              }
            >
              <CommandItem
                className=" cursor-pointer"
                value={status.value}
                onSelect={(value) => {
                  setSelectedStatus(
                    statuses.find((priority) => priority.value === value) ||
                      null
                  );
                  setOpen(false);
                }}
              >
                {status.label}
              </CommandItem>
            </Link>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
