"use client";

import { getCardAnalytics } from "@/lib/analytics";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { List } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { motion } from "motion/react";

interface ListCardsProps {
  lists: { data: List[] };
  selectedList: number;
  setSelectedList: (index: number) => void;
}

export default function ListCards({
  lists,
  selectedList,
  setSelectedList,
}: ListCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {lists?.data?.map((list, index) => (
        <ListCard
          key={list.id}
          list={list}
          index={index}
          selectedList={selectedList}
          setSelectedList={setSelectedList}
        />
      ))}
    </div>
  );
}

function ListCard({
  list,
  index,
  selectedList,
  setSelectedList,
}: {
  list: List;
  index: number;
  selectedList: number;
  setSelectedList: (index: number) => void;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["analytics", list.id],
    queryFn: () => getCardAnalytics(list.id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const totalSolved = data?.data?.total_solved ?? 0;
  const totalQuestions = data?.data?.total_questions ?? 0;
  const targetPercent = totalQuestions > 0 ? (totalSolved / totalQuestions) * 100 : 0;
  const targetOffset = circumference * (1 - targetPercent / 100);

  if (isLoading) {
    return (
      <motion.div
        key={list.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="cursor-pointer"
      >
        <Card className="border-almond-darker h-full bg-transparent p-0">
          <div className="space-y-4 p-6">
            <Skeleton className="bg-charcoal/10 dark:bg-almond/10 h-6 w-1/2" />
            <Skeleton className="bg-charcoal/10 dark:bg-almond/10 h-4 w-3/4" />
            <div className="mt-4 flex flex-row items-center justify-between gap-4 sm:gap-6 lg:flex-col lg:gap-4 xl:flex-row xl:gap-6">
              <Skeleton className="bg-charcoal/10 dark:bg-almond/10 w-full max-w-[120px] aspect-square rounded-full shrink-0" />
              <div className="w-full space-y-3">
                <Skeleton className="bg-charcoal/10 dark:bg-almond/10 h-4 w-full" />
                <Skeleton className="bg-charcoal/10 dark:bg-almond/10 h-4 w-5/6" />
                <Skeleton className="bg-charcoal/10 dark:bg-almond/10 h-4 w-2/3" />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        key={list.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="cursor-pointer"
      >
        <Card className="border-almond-dark/30 h-full bg-transparent">
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <AlertTriangle
              size={30}
              className="mb-2 text-red-600 dark:text-red-300"
            />
            <p className="font-semibold">Failed to load analytics</p>
            <p className="text-muted-foreground text-sm">
              Please try again later
            </p>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={list.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="cursor-pointer"
      onClick={() => setSelectedList(index)}
    >
      <Card
        className={`bg-almond-lighter border-almond-dark/30 text-charcoal dark:text-almond transition-all duration-300 hover:shadow-xl ${
          selectedList === index && "dark:border-almond-dark shadow-lg"
        } p-0`}
      >
        <div className="p-6">
          <h1 className="text-charcoal dark:text-almond text-2xl font-bold">
            {list.name}
          </h1>
          <p className="text-muted-foreground text-sm">
            {`${data?.data.total_questions} questions • ${data?.data.total_solutions} solutions • ${data?.data.total_user_attempts} attempts`}
          </p>

          <div className="mt-4 flex flex-row items-center justify-between gap-4 sm:gap-6 lg:flex-col lg:gap-4 xl:flex-row xl:gap-6">
            <div className="relative w-full max-w-[120px] aspect-square shrink-0">
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                role="progressbar"
                aria-label="Solved progress"
              >
                <g
                  style={{
                    transform: "rotate(90deg)",
                    transformOrigin: "50% 50%",
                  }}
                >
                  <circle cx={100} cy={100} r={68} fill="none" />
                  <motion.circle
                    cx={100}
                    cy={100}
                    r={68}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }} // empty circle
                    animate={{ strokeDashoffset: targetOffset }} // animate to progress
                    transition={{
                      duration: 1.2,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  />
                </g>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span className="text-lg font-bold">
                  {data?.data.total_solved}
                </motion.span>
                <span className="text-[10px]">/{data?.data.total_questions}</span>
                <span className="text-[10px]">Solved</span>
              </div>
            </div>

            <div className="w-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-teal-600">Easy</span>
                <span className="text-muted-foreground text-sm">
                  <motion.span>{data?.data.total_easy_solved}</motion.span>/
                  {data?.data.total_easy_q}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-600">Medium</span>
                <span className="text-muted-foreground text-sm">
                  <motion.span>{data?.data.total_medium_solved}</motion.span>/
                  {data?.data.total_medium_q}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-600">Hard</span>
                <span className="text-muted-foreground text-sm">
                  <motion.span>{data?.data.total_hard_solved}</motion.span>/
                  {data?.data.total_hard_q}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
