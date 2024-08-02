"use client";

import {
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { Button } from "@repo/ui/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProblemColumns, userProblemDetailsType } from "./columns";
import {
  NeetcodeProblemDetails,
  useNeetcodeColumns,
} from "../neetcode/columns";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@repo/ui/components/ui/select";
import { List, Topic } from "@repo/db";
import React from "react";
import { getAllGeneralTopics, getTopicsByList } from "../actions/topics";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { useSession } from "next-auth/react";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { COLUMN_VISIBILITY_BREAKPOINTS } from "@/lib/utils";

type ProblemDetails = userProblemDetailsType | NeetcodeProblemDetails;

type DataTableProps<TData extends ProblemDetails> = {
  data: TData[];
  tag: "general" | "neetcode";
  lists?: List[];
  allTopics?: Topic[];
};

export function DataTable<TData extends ProblemDetails>({
  data,
  tag,
  lists,
  allTopics,
}: DataTableProps<TData>) {
  console.log(data);
  const { data: session } = useSession();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [topics, setTopics] = useState<Topic[]>(allTopics ?? []);
  const [sorting, setSorting] = useState<SortingState>([]);
  const { height, width } = useWindowDimensions();

  const columns =
    tag === "general" ? useUserProblemColumns() : useNeetcodeColumns();

  const router = useRouter();
  const table = useReactTable({
    data,
    columns: columns as ColumnDef<TData, any>[],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    initialState: { pagination: { pageSize: 30 } },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  useEffect(() => {
    const newColumnVisibility =
      COLUMN_VISIBILITY_BREAKPOINTS.find((point) => width <= point.max)
        ?.columns || {};
    setColumnVisibility((prev) => ({ ...prev, ...newColumnVisibility }));
  }, [width]);

  function handleRowClick(problemName: string) {
    problemName = problemName.split(" ").join("-");
    router.push(`/problems/${problemName}`);
  }

  async function handleListChange(listName: string) {
    if (listName === "All Lists") {
      table.getColumn("lists")?.setFilterValue(undefined);
      const newTopicList = await getAllGeneralTopics();
      setTopics(newTopicList as Topic[]);
    } else {
      table.getColumn("lists")?.setFilterValue(listName);
      let listId = lists!.find((list) => list.name === listName)?.id || "";
      const newTopicList = await getTopicsByList(listId);
      setTopics(newTopicList as Topic[]);
    }
  }

  function handleTopicChange(topicName: string) {
    if (topicName === "All topics") {
      table.getColumn("topics")?.setFilterValue(undefined);
    } else {
      table.getColumn("topics")?.setFilterValue(topicName);
    }
  }

  function handleBookmarkChange(checked: boolean) {
    table.getColumn("bookmarks")?.setFilterValue(checked);
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-5 mb-4 text-muted-foreground">
        <Select onValueChange={handleTopicChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All topics">--All Topics--</SelectItem>
            {topics.map((topic) => (
              <SelectItem key={topic.id} value={topic.name}>
                {topic.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {tag === "general" && (
          <>
            <Select onValueChange={handleListChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by List" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Lists">--All Lists--</SelectItem>
                {lists &&
                  lists.map((list) => (
                    <SelectItem key={list.id} value={list.name}>
                      {list.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </>
        )}
        <div className="flex items-center gap-2 ">
          <Checkbox
            id="terms1"
            onCheckedChange={handleBookmarkChange}
            disabled={session && session.user ? false : true}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms1"
              className="text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70 line-clamp-1"
            >
              Show Bookmarked Problems
            </label>
          </div>
        </div>
      </div>
      <div className="rounded-md border text-muted-foreground">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="px-4"
                      style={{ width: header.getSize() }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    onClick={() => handleRowClick(row.getValue("name"))}
                    className="hover:cursor-pointer hover:text-primary"
                  >
                    {row.getVisibleCells().map((cell) => {
                      if (
                        cell.column.id === "bookmarks" ||
                        cell.column.id === "link"
                      ) {
                        return (
                          <TableCell
                            key={cell.id}
                            className="px-4 z-10"
                            style={{ width: cell.column.getSize() }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell
                          key={cell.id}
                          className="px-4 "
                          style={{ width: cell.column.getSize() }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <span className="mr-auto text-sm text-muted-foreground pl-2">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </>
  );
}
