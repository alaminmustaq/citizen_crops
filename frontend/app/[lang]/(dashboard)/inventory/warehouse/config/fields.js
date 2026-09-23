const fields = (form) => [
  // ===== Warehouse Basic Info =====
  {
    name: "name",
    type: "text",
    label: "Warehouse Name *",
    placeholder: "Enter warehouse name",
    colSpan: "col-span-12 md:col-span-6",
    rules: { required: "Warehouse name is required" },
  },
  {
    name: "location",
    type: "text",
    label: "Location *",
    placeholder: "Enter warehouse location",
    colSpan: "col-span-12 md:col-span-6",
    rules: { required: "Location is required" },
  },

  // ===== Status Selection =====
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
  },

];

export default fields;
