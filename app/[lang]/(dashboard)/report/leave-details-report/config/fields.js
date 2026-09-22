

const leaveDetailsReportFilters = (form) => {

  return [
    {
      name: "start_date",
      type: "date",
      label: "Start Date",
      colSpan: "col-span-12 md:col-span-3",
    },
    {
      name: "end_date",
      type: "date",
      label: "End Date",
      colSpan: "col-span-12 md:col-span-3",
       rules: {
    validate: (value, form) => {
      if (form.start_date && value) {
        return (
          new Date(form.start_date) <= new Date(value) ||
          "Start date cannot be Before end date"
        );
      }
      return true;
    },
     },
    },
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
      name: "project_id",
      type: "async-select",
      label: "Project",
      loadOptions: ["projects", "projects", "projectTemplate"],
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
    {
      name: "type",
      type: "select",
      label: "Type",
      options: [
        { label: "Single", value: "single" },
        { label: "Department", value: "department_leave" },
        { label: "Project", value: "project_leave" },
        { label: "Single Project", value: "single_project_leave" },
      ],
      colSpan: "col-span-12 md:col-span-3",
    },
    {
      name: "reason_id",
      type: "async-select",
      label: "Leave Reason",
      loadOptions: [
        "leave/leave_reason",
        "leave_reasons",
        "leaveReasonSearchTemplate",
      ],
      colSpan: "col-span-12 md:col-span-3",
    },
  ];
};

export default leaveDetailsReportFilters;
