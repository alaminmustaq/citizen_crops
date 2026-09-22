
const filterFields = (form) => {

    // ===== Stock Transfer Master Fields =====
     return [
    {
        name: "transfer_date",
        type: "input",
        label: "Transfer Date",
        placeholder: "Select transfer date",
        colSpan: "col-span-12 md:col-span-3",
        inputProps: { type: "date" },
    },
    {
        name: "sender_warehouse_id",
        type: "async-select",
        label: "Sender Warehouse",
        loadOptions: [
            "inventory/warehouses",
            "warehouses",
            "warehouseSearchTemplate",
        ],
        placeholder: "Select sender warehouse",
        colSpan: "col-span-12 md:col-span-3",
       
    },
    {
        name: "destination_warehouse_id",
        type: "async-select",
        label: "Destination Warehouse",
        loadOptions: [
            "inventory/warehouses",
            "warehouses",
            "warehouseSearchTemplate",
        ],
        placeholder: "Select destination warehouse",
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
      placeholder: "Select branch",
      colSpan: "col-span-12 md:col-span-3",
  },

    {
        name: "transfer_status",
        type: "select",
        label: "Transfer Status",
        placeholder: "Select status",
        colSpan: "col-span-12 md:col-span-3",
        options: [
            { label: "New", value: "new" },
            { label: "Pending", value: "pending" },
            { label: "Received", value: "received" },
        ], 
    }, 

  
];
}

export default filterFields;
