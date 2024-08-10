import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";
import Card3D from "../problems/_components/Card3d";

export default function SearchDisplay({
  searchResults,
}: {
  searchResults: any[];
}) {
  return (
    <Card3D>
      <Card>
        <CardHeader className="-mt-4">
          <CardTitle className="text-lg font-medium">Problems</CardTitle>
        </CardHeader>
        <CardContent className="-mt-4 flex flex-col">
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => {
              return (
                <Link
                  key={index}
                  href={`/problems/${result.name.split(" ").join("-")}`}
                  className="flex items-center gap-2 "
                >
                  <p className="w-4/5 text-sm text-muted-foreground hover:text-primary line-clamp-1">
                    {result.name}
                  </p>
                  <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary" />
                </Link>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">No problems Found</p>
          )}
        </CardContent>
      </Card>
    </Card3D>
  );
}
