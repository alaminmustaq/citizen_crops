const fields = () => {
  return [
    {
      name: "name",
      type: "input",
      label: "Employee Shift Name *",
      placeholder: "Enter employee shift name",
      colSpan: "col-span-12 md:col-span-6",
      rules: {
        required: "Employee shift name is required",
        maxLength: { value: 150, message: "Max 150 characters" },
      },
      inputProps: { maxLength: 150 },
    },
    {
      name: "type",
      type: "select",
      label: "Shift Type *",
      placeholder: "Select shift type",
      colSpan: "col-span-12 md:col-span-6",
      options: [
        { label: "Day Shift", value: "day" },
        { label: "Night Shift", value: "night" },
      ],
      rules: {
        required: "Shift type is required",
      },
    },
    {
      name: "status",
      type: "select",
      label: "Status *",
      placeholder: "Select status",
      colSpan: "col-span-12 md:col-span-6",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
      rules: {
        required: "Status is required",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      placeholder: "Optional description",
      colSpan: "col-span-12",
      rules: {
        maxLength: { value: 500, message: "Max 500 characters" },
      },
    },
  ];
};

export default fields;
