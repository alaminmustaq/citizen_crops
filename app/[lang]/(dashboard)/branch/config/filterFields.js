const filterFields= (form) => [
    // =============== Relations ===============

    {
        name: "parent_branch_id",
        type: "async-select",
        label: "Parent Branch",
        loadOptions: [
            "organization/branches",
            "branches",
            "branchSearchTemplate",
        ],
        colSpan: "col-span-12 md:col-span-4",
    },

    // =============== Core Info ===============
    // {
    //     name: "branch_id",
    //     type: "async-select",
    //     label: "Branch",
    //     loadOptions: [
    //         "organization/branches",
    //         "branches",
    //         "branchSearchTemplate",
    //     ],
    //     placeholder: "Select",
    //     colSpan: "col-span-12 md:col-span-6",
    // },
  
    
   
    {
        name: "status",
        type: "select",
        label: "Status ",
        colSpan: "col-span-12 md:col-span-4",
        options: [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
            { label: "Suspended", value: "suspended" },
            { label: "Closed", value: "closed" },
        ],

    },
 
];

export default filterFields;
