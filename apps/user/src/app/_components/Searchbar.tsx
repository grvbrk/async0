"use client";
import React, { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { searchProblemQuery } from "../actions/search";
import { Input } from "@repo/ui/components/ui/input";
import { MAX_QUERY_LENGTH } from "@/lib/utils";
import { Search } from "lucide-react";
import { toast } from "sonner";
import SearchDisplay from "./SearchDisplay";
import useMeasure from "react-use-measure";

export default function Searchbar() {
  const [text, setText] = useState<string>("");
  const [showCard, setShowCard] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const debouncedText = useDebounce(text, 0.5);
  let [ref, { width }] = useMeasure();

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
    }

    fetchData();
  }, [debouncedText]);
  return (
    <div ref={ref}>
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
          className="pl-8"
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
        <div
          className={`absolute mt-3`}
          style={{ width: `${width < 200 ? 200 : width}px` }}
        >
          <SearchDisplay searchResults={searchResults} />
        </div>
      )}
    </div>
  );
}
