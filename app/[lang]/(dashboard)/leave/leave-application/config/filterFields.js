
const filterFields = (form) => {

  return [
  
    {
      name: "employee_ids",
      type: "multi-async-select",
      label: "Employee",
      loadOptions: ["hrm/employees", "employees", "employTemplate"],
      colSpan: "col-span-12 md:col-span-3",
    },
    {
      name: "branch_id",
      type: "async-select",
      label: "Branch",
      loadOptions: [
        "organization/branches",
        "branches",
        "branchSearchTemplate",
      ],
      colSpan: "col-span-12 md:col-span-3",
    },
    {
      name: "department_id",
      type: "async-select",
      label: "Department",
      loadOptions: [
        "organization/departments",
        "departments",
        "departmentSearchTemplate",
        "branch_id",
      ],
      colSpan: "col-span-12 md:col-span-3",
    },
   
    {
      name: "leave_type_id",
      type: "async-select",
      label: "Leave Type",
      loadOptions: [
        "leave/leave_type",
        "leave_types",
        "leaveTypeSearchTemplate",
      ],
      colSpan: "col-span-12 md:col-span-3",
    },
    {
      name: "leave_status",
      type: "select",
      label: "Status",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
      ],
      colSpan: "col-span-12 md:col-span-3",
    },
  ];
};

export default filterFields;
