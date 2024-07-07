import Link from "next/link";
import { getAllProblemsWithTestcases } from "@/actions/problems";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@repo/ui/components/ui/dropdown-menu";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@repo/ui/components/ui/table";
import { Button } from "@repo/ui/components/ui/button";
import { CheckCircle2, XCircle, MoreVertical } from "lucide-react";

export default function AdminProblemPage() {
  return (
    <>
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">Problem Board</h3>
          <p className="text-sm">
            You can activate/deactivate and modify problems here.
          </p>
        </div>
        <Button asChild>
          <Link href="/problems/new"> Add Problem </Link>
        </Button>
      </div>
      <ProblemsTable />
    </>
  );
}

async function ProblemsTable() {
  const problems = (await getAllProblemsWithTestcases()) || [];

  return (
    <>
      {problems.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-0">
                <span className="sr-only">Available for Purchase</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Concept</TableHead>
              <TableHead>Testcases</TableHead>
              <TableHead className="w-0">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {problems.map((problem) => {
              return (
                <TableRow key={problem.id}>
                  <TableCell>
                    {problem.isActiveForSubmission ? (
                      <>
                        <span className="sr-only">Available</span>
                        <CheckCircle2 className="text-green-600" />
                      </>
                    ) : (
                      <>
                        <span className="sr-only ">Unavailable</span>
                        <XCircle className="stroke-destructive" />
                      </>
                    )}
                  </TableCell>
                  <TableCell>{problem.name}</TableCell>
                  <TableCell>$100</TableCell>
                  <TableCell>{problem.testcases.length}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical />
                        <span className="sr-only">Actions</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                          <a download href={`/problems/${problem.id}/download`}>
                            Download
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/problems/${problem.id}/edit`}>
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        {/* <ActiveToggleDropDownItem
                      id={product.id}
                      isavailableforpurchase={product.isavailableforpurchase}
                    /> */}
                        <DropdownMenuSeparator />
                        {/* <DeleteDropDownItem
                      id={product.id}
                      disabled={NumberOfOrders?.rows[0].count > 0}
                      imagePath={product.imagepath}
                      filePath={product.filepath}
                    /> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <h1>No problems found</h1>
      )}
    </>
  );
}
