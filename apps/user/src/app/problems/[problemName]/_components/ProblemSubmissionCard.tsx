import { Submission } from "@repo/db";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@repo/ui/components/ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@repo/ui/components/ui/table";
import { Badge, Table } from "lucide-react";
import React from "react";

export default function ProblemSubmissionCard({
  submissions,
}: {
  submissions: Submission[];
}) {
  return (
    <Card className="h-[75vh] overflow-y-auto">
      {submissions.length > 0 ? (
        <>
          <CardHeader>
            <CardTitle className="flex items-center">Submissions</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </>
      ) : (
        <h1>No submissions Found.</h1>
      )}
    </Card>
  );
}
