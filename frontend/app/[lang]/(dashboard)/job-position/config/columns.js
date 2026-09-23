import { TableActions } from "@/components/table/TableActions";

const val = (v, f = "—") => (v ?? v === 0 ? v : f);

const fmtSalary = (row) => {
  const s = row.original?.salary_and_benefits || {};
  const min = s.min_salary;
  const max = s.max_salary;
  const cur = s.currency;
  const per = s.salary_type;
  if (min == null && max == null) return "—";
  const range =
    min != null && max != null
      ? `${min}–${max}`
      : min != null
      ? `${min}+`
      : `${max}`;
  return [range, cur, per].filter(Boolean).join(" ");
};

let columns = (actions) => [
  // Core
  { accessorKey: "title", header: "Title" },
  // { accessorKey: "code", header: "Code" ,thClass: "!text-center", 
  //   tdClass: "!text-center",},

  // Classification
  // {
  //   id: "type",
  //   header: "Type",
  //   cell: ({ row }) => val(row.original?.type),
  // },
  {
    id: "job_category",
    header: "Category",
    thClass: "!text-center", 
    tdClass: "!text-center",
    cell: ({ row }) => val(row.original?.classification_info?.job_category),
  },
  {
    id: "employment_type",
    header: "Employment",
    thClass: "!text-center", 
    tdClass: "!text-center",
    cell: ({ row }) => val(row.original?.classification_info?.employment_type),
  },
  // {
  //   id: "level",
  //   header: "Level",
  //   cell: ({ row }) => val(row.original?.position_info?.level),
  // },
 

  // Salary
  // {
  //   id: "salary",
  //   header: "Salary",
  //   thClass: "!text-center", 
  //   tdClass: "!text-center",
  //   cell: ({ row }) => fmtSalary(row),
  // },

  // Vacancy metrics
  // {
  //   id: "vacancies",
  //   header: "Vacancies",
  //   thClass: "!text-center", 
  //   tdClass: "!text-center",
  //   cell: ({ row }) => {
  //     const m = row.original?.position_info || {};
  //     const t = m.total_positions ?? "—";
  //     const f = m.filled_positions ?? "—";
  //     const v = m.vacant_positions ?? "—";
  //     return `${t}/${f}/${v}`;
  //   },
  // },

  // Recruiting & status
  // {
  //   id: "recruiting",
  //   header: "Recruiting",
  //   thClass: "!text-center", 
  //   tdClass: "!text-center",
  //   cell: ({ row }) =>
  //     row.original?.recruitment_info?.is_active_recruitment ? "Yes" : "No",
  // },
  {
    id: "status",
    header: "Status",
    thClass: "!text-center", 
    tdClass: "!text-center",
    cell: ({ row }) => val(row.original?.system_info?.status),
  },
  // {
  //   id: "enabled",
  //   header: "Enabled",
  //   thClass: "!text-center", 
  //   tdClass: "!text-center",
  //   cell: ({ row }) => (row.original?.system_info?.is_enabled ? "Yes" : "No"),
  // },

  // Actions 
  {
    id: "actions",
    enableHiding: false,
    header: " ",
    thClass: "!text-center w-[70px] whitespace-nowrap", 
    tdClass: "!text-center w-[70px] whitespace-nowrap",
    cell: ({ row }) => (
      <TableActions
        data={row.original}
        label="Actions"
        // alignmentClass is omitted here, so it defaults to "flex justify-center"
        items={[
          { label: "Edit", onClick: actions?.onEdit, permission: "edit-job-position"}, // needs full data
          { label: "Delete", onClick: actions?.onDelete, danger: true, passId: true, permission: "delete-job-position"}, // needs only ID
        ]}
      />
    ),
  }

  
];

export default columns;