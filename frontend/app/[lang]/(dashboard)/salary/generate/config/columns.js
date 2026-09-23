const safe = (v, fallback = "—") => (v ?? v === 0 ? v : fallback);

let columns = (actions) => [
    // Core employee info
    {
    header: "Name",
    accessorKey: "employee", // pass the whole employee object
    cell: ({ row }) => {
        const emp = row.original.employee;
        return `${emp.first_name ?? ""} ${emp.last_name ?? ""}`;
    }
    },
    { accessorKey: "employee.employee_code", header: "Code" },

    // Company
    // {
    //     id: "company",
    //     header: "Company",
    //     cell: ({ row }) => row.original?.company?.name ?? "-",
    // },
    // Branch
    // {
    //     id: "branch",
    //     header: "Branch",
    //     cell: ({ row }) => row.original?.branch?.name ?? "-",
    // },
    // Department
    // {
    //     id: "department",
    //     header: "Department",
    //     cell: ({ row }) => row.original?.department?.name ?? "-",
    // },
    // Job Position
    {
        id: "job_position",
        header: "Job Position",
        cell: ({ row }) => row.original?.job_position?.title ?? "-",
    },

    // Salary month
    {
        id: "salary_month",
        header: "Salary Month",
        cell: ({ row }) => safe(row.original?.salary_month),
    },
    // Basic Salary (per-minute rate)
    // {
    //     id: "basic_salary",
    //     header: "Basic Salary",
    //     cell: ({ row }) => safe(row.original?.basic_salary),
    // },
    // Total worked minutes
    // {
    //     id: "total_worked_minutes",
    //     header: "Worked Minutes",
    //     cell: ({ row }) => safe(row.original?.total_worked_minutes),
    // },
    // Total worked hours
    // {
    //     id: "total_worked_hours",
    //     header: "Worked Hours",
    //     cell: ({ row }) => safe(row.original?.total_worked_hours),
    // },
    // Earned salary
    // {
    //     id: "earned_salary",
    //     header: "Earned Salary",
    //     cell: ({ row }) => safe(row.original?.earned_salary),
    // },
    // Allowances
    // {
    //     id: "allowances",
    //     header: "Allowances",
    //     cell: ({ row }) => safe(row.original?.allowances),
    // },
    // Deductions
    // {
    //     id: "deductions",
    //     header: "Deductions",
    //     cell: ({ row }) => safe(row.original?.deductions),
    // },
    // Net payable
    {
        id: "net_payable",
        header: "Net Payable",
        cell: ({ row }) => safe(row.original?.net_payable),
    },
    // Status
    {
        id: "status",
        header: "Status",
        cell: ({ row }) => safe(row.original?.status),
    },
    // Notes
    // {
    //     id: "notes",
    //     header: "Notes",
    //     cell: ({ row }) => safe(row.original?.notes),
    // },
];

export default columns;
