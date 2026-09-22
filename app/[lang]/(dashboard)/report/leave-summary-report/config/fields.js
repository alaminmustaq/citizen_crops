

const leaveDetailsReportFilters = (form) => {
  const startDate = form.watch("start_date");
  const endDate = form.watch("end_date");

  // Calculate min/max dates for HTML date input (YYYY-MM-DD format)
  const getYearConstraints = (selectedDate) => {
    if (!selectedDate) return {};
    const year = new Date(selectedDate).getFullYear();
    return {
      min: `${year}-01-01`,
      max: `${year}-12-31`,
    };
  };

  return [
    {
      name: "start_date",
      type: "date",
      label: "Start Date",
      colSpan: "col-span-12 md:col-span-3",
      inputProps: endDate ? getYearConstraints(endDate) : {},
    },
    {
      name: "end_date",
      type: "date",
      label: "End Date",
      colSpan: "col-span-12 md:col-span-3",
      inputProps: startDate ? getYearConstraints(startDate) : {},
    },
    {
      name: "employee_ids",
      type: "multi-async-select",
      label: "Employee",
      loadOptions: ["hrm/employees", "employees", "employTemplate"],
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
  ];
};

export default leaveDetailsReportFilters;
