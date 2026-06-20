"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useState, useTransition } from "react";
import ProblemsTable from "./problems-table";
import { useQuery } from "@tanstack/react-query";
import { getAllLists } from "@/lib/list";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import ListCards from "./list-cards";

export default function ProblemUI() {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [selectedList, setSelectedList] = useState<number>(0);
  const [isLoading, startTransition] = useTransition();
  const [selectedProblem, setSelectedProblem] = useState<string>();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const {
    data: lists,
    isLoading: isListLoading,
    isError: isListError,
  } = useQuery({
    queryKey: ["lists"],
    queryFn: getAllLists,
  });

  const handleRowClick = useCallback(
    (slug: string, name: string) => {
      setSelectedProblem(name);
      startTransition(async () => {
        router.push(`/problems/${slug}`);
      });
    },
    [router],
  );

  if (!hasMounted || isListLoading) {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <div className="flex animate-spin items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (isListError || !lists) {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <p>Something went wrong...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative mr-4 ml-8 flex flex-1 flex-col md:mr-8 md:ml-16">
      {isLoading && (
        <div className="bg-almond dark:bg-charcoal dark:text-almond-dark text-charcoal absolute inset-0 z-50 flex items-center justify-center rounded-md">
          <Loader className="animate-spin" />
          <p className="pl-4 text-center text-sm">
            {` Loading problem - ${selectedProblem}`}
          </p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-1 flex-col gap-12"
      >
        <ListCards
          lists={lists}
          selectedList={selectedList}
          setSelectedList={setSelectedList}
        />

        {lists?.data && lists.data.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-12 min-h-0 flex-1"
          >
            <ProblemsTable
              selectedListID={lists?.data[selectedList]?.id}
              handleRowClick={handleRowClick}
            />
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
