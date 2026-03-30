import { Badge } from "@/components/ui/badge";
import { TableRow, TableCell } from "@/components/ui/table";

interface VendorRowProps {
  vendor: {
    id: string;
    name: string;
    trade: string;
    email: string | null;
    phone: string | null;
    rateNotes: string | null;
    preferenceScore: number | null;
  };
}

export function VendorRow({ vendor }: VendorRowProps) {
  const score = vendor.preferenceScore ?? 0.5;

  return (
    <TableRow>
      <TableCell className="font-medium">{vendor.name}</TableCell>
      <TableCell>
        <Badge variant="trade" value={vendor.trade} />
      </TableCell>
      <TableCell>{vendor.email ?? "-"}</TableCell>
      <TableCell>{vendor.phone ?? "-"}</TableCell>
      <TableCell>{vendor.rateNotes ?? "-"}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-20 h-2 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${score * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted">{score.toFixed(1)}</span>
        </div>
      </TableCell>
    </TableRow>
  );
}
