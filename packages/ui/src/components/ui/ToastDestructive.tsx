"use client";

import { Button } from "./button";
import { ToastAction } from "./toast";
import { useToast } from "./use-toast";

export function ToastDestructive() {
  const { toast } = useToast();

  return (
    <Button
      variant="outline"
      onClick={() => {
        console.log("Clicked");
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }}
    >
      Show Toast
    </Button>
  );
}
