import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const safe = (value, fallback = "-") => (value || value === 0 ? value : fallback);

const money = (value) => Number(value || 0).toFixed(2);

const columns = (actions) => [
    {
        header: "Name",
        accessorKey: "employee",
        cell: ({ row }) => {
            const employee = row.original?.employee;
            return employee
                ? `${employee.first_name ?? ""} ${employee.last_name ?? ""}`.trim()
                : "-";
        },
    },
    {
        header: "Code",
        accessorKey: "employee.employee_code",
    },
    {
        id: "job_position",
        header: "Job Position",
        cell: ({ row }) => safe(row.original?.job_position?.title || row.original?.employee?.job_position?.title),
    },
    {
        id: "department",
        header: "Department",
        cell: ({ row }) => safe(row.original?.department?.name || row.original?.employee?.department?.name),
    },
    {
        id: "salary_month",
        header: "Salary Month",
        cell: ({ row }) => safe(row.original?.salary_month),
    },
    {
        id: "earned_salary",
        header: "Gross Earnings",
        cell: ({ row }) => money(row.original?.earned_salary),
    },
    {
        id: "deductions",
        header: "Deductions",
        cell: ({ row }) => money(row.original?.deductions),
    },
    {
        id: "net_payable",
        header: "Net Payable",
        cell: ({ row }) => money(row.original?.net_payable),
    },
    {
        id: "admin_status",
        header: "Status",
        cell: ({ row }) => safe(row.original?.admin_status),
    },
    {
        id: "actions",
        header: "Pay Slip",
        cell: ({ row }) => (
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => actions?.onPdf?.(row.original)}
            >
                <FileText className="h-4 w-4" />
                PDF
            </Button>
        ),
    },
];

export default columns;
