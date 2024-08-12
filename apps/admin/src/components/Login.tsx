"use client";
import { getProviders, signIn } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { ProvidersResponse } from "./Navbar";
import { Button } from "@repo/ui/components/ui/button";
import { LogIn } from "lucide-react";

export default function Login() {
  const [providers, setProviders] = useState<ProvidersResponse | null>(null);

  useEffect(() => {
    async function setAuthProviders() {
      const response = (await getProviders()) as ProvidersResponse;
      setProviders(response);
    }

    setAuthProviders();
  }, []);

  return (
    <div>
      {providers &&
        Object.values(providers).map((provider, idx) => {
          return (
            <Button key={idx} onClick={() => signIn(provider.id)}>
              <LogIn size="16" className="mr-2" />
              Sign up
            </Button>
          );
        })}
    </div>
  );
}
