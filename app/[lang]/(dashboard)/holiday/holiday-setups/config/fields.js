const fields = (form) => [
  // ===== Holiday Name =====
  {
    name: "name",
    type: "text",
    label: "Holiday Name *",
    placeholder: "Enter holiday name",
    colSpan: "col-span-12 md:col-span-6",
    rules: { required: "Holiday name is required" },
  },

  // ===== Holiday Type ===== 
  {
      name: "holiday_type_id",
      type: "async-select",
      label: "Holiday Type *",
      loadOptions: [
          "holiday/holiday_type",
          "holiday_types",
          "holidayTypeSearchTemplate",
      ],
      placeholder: "Select",
      colSpan: "col-span-12 md:col-span-6", 
      rules: { required: "Holiday type is required" },
  },

  // ===== Start Date =====
  {
    name: "start_date",
    type: "date",
    label: "Start Date *",
    colSpan: "col-span-12 md:col-span-6",
    rules: { required: "Start date is required" },
  },

  // ===== End Date =====
  {
    name: "end_date",
    type: "date",
    label: "End Date *",
    colSpan: "col-span-12 md:col-span-6",
    rules: {
      required: "End date is required",
      validate: (value) =>
        !form?.start_date || value > form.start_date || "End date must be after start date",
    },
  },

  // ===== Description =====
  {
    name: "description",
    type: "textarea",
    label: "Description",
    placeholder: "Optional description",
    colSpan: "col-span-12",
  },

  // ===== Status =====
  {
    name: "status",
    type: "select",
    label: "Status *",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
    placeholder: "Select status",
    colSpan: "col-span-12 md:col-span-6",
    rules: { required: "Status is required" },
    defaultValue: "active",
  },
];

export default fields;
