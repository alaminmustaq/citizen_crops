const filterFields = () => {
    return [
        // =============== Core ===============
          {
            name: "branch_id",
            type: "async-select",
            label: "Branch",
            loadOptions: [
                "organization/branches",
                "branches",
                "branchSearchTemplate",
            ],
            placeholder: "Select",
            colSpan: "col-span-12 md:col-span-4",
        },
        {   name: "client_id",
            type: "async-select",
            label: "Client",
            loadOptions: [
                "clients/clients", 
                "clients",
                "clientTemplate",
            ],
            placeholder: "Select client",
            colSpan: "col-span-12 md:col-span-4",
        }, 
       
        {
            name: "client_type",
            type: "select",
            label: "Client Type",
            placeholder: "Select client type",
            colSpan: "col-span-12 md:col-span-4",
            options: [
                { label: "Individual", value: "individual" },
                { label: "Business", value: "business" },
            ],
        },
       
        {
            name: "status",
            type: "select",
            label: "Status",
            placeholder: "Select status",
            colSpan: "col-span-12 md:col-span-4",
            options: [
              
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
        },
     
    ];
  };
  
  export default filterFields;
  