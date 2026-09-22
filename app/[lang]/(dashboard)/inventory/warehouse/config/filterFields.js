const filterFields = (form) => [
  // ===== Warehouse Basic Info =====
   {
        name: "warehouse_id",
        type: "async-select",
        label: "Warehouse",
        loadOptions: [
            "inventory/warehouses",
            "warehouses",
            "warehouseSearchTemplate",
        ],
        placeholder: "Select Warehouse",
        colSpan: "col-span-12 md:col-span-3",
        // rules: { required: "Warehouse is required" },
    },
  
    // {
    //     name: "location",
    //     type: "async-select",
    //     label: "Location",
    //     loadOptions: [
    //         "inventory/warehouses",
    //         "warehouses",
    //         "warehouseSearchTemplate",
    //     ],
    //     placeholder: "Select Location",
    //     colSpan: "col-span-12 md:col-span-3",
    //     // rules: { required: "Location is required" },
    // },

  // ===== Status Selection =====
  {
    name: "status",
    type: "select",
    label: "Status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
    placeholder: "Select status",
    colSpan: "col-span-12 md:col-span-3",
   
  },

];

export default filterFields;
