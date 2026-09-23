const val = (v, f = "—") => (v ?? v === 0 ? v : f);

let columns = (actions) => [
  // Employee
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => val(row.original?.employee?.name),
  },
  {
    id: "employee_number",
    header: "Employee Code",
    cell: ({ row }) => val(row.original?.employee?.employee_number),
  },

  

  // Branch
  {
    id: "branch",
    header: "Branch",
    cell: ({ row }) => row.original?.branch?.name ?? "-",
  },

  // Department
  {
    id: "department",
    header: "Department",
    cell: ({ row }) =>
      row.original?.department?.name ?? row.original?.employee?.department ?? "-",
  },

  // Date
  {
    id: "date",
    header: "Date",
    cell: ({ row }) => val(row.original?.date),
  },

  // Check In / Check Out
  {
    id: "check_in_time",
    header: "Check In Time",
    cell: ({ row }) => val(row.original?.check_in_time),
  },

];

export default columns;
