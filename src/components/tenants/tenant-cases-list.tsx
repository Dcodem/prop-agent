import Link from "next/link";
import type { Case } from "@/lib/db/schema";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "@/components/ui/table";

interface TenantCasesListProps {
  cases: Case[];
}

export function TenantCasesList({ cases }: TenantCasesListProps) {
  if (cases.length === 0) {
    return <p className="text-sm text-muted">No cases for this tenant.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <tr>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Urgency</TableHeaderCell>
          <TableHeaderCell>Message</TableHeaderCell>
          <TableHeaderCell>Created</TableHeaderCell>
        </tr>
      </TableHeader>
      <TableBody>
        {cases.map((c) => (
          <TableRow key={c.id}>
            <TableCell>
              <Badge variant="status" value={c.status} />
            </TableCell>
            <TableCell>
              {c.urgency ? (
                <Badge variant="urgency" value={c.urgency} />
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell>
              <Link
                href={`/cases/${c.id}`}
                className="text-primary hover:underline"
              >
                {c.rawMessage.length > 60
                  ? c.rawMessage.slice(0, 60) + "..."
                  : c.rawMessage}
              </Link>
            </TableCell>
            <TableCell className="text-muted">
              {timeAgo(c.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
