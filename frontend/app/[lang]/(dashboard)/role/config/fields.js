const fields = [
    // Core
    {
        name: "name",
        type: "input",
        label: "Role Name",
        placeholder: "super_admin",
        colSpan: "col-span-12 md:col-span-6",
        rules: { required: "Role Name is required" },
    },
    {
        name: "display_name",
        type: "input",
        label: "Display Name",
        placeholder: "Super Admin",
        colSpan: "col-span-12 md:col-span-6",
        rules: { required: "Display Name is required" },
    }, 
    // {
    //     name: "is_system",
    //     type: "checkbox",
    //     label: "Is System",
    //     placeholder: "Is system",
    //     colSpan: "col-span-12 md:col-span-6",
    // },
    {
        name: "level",
        type: "select",
        label: "Level",
        placeholder: "Select Level",
        colSpan: "col-span-12 md:col-span-6",
        options: [
            { label: "Level 1", value: "1" },
            { label: "Level 2", value: "2" },
            { label: "Level 3", value: "3" }, 
        ],
    },
    {
        name: "description",
        type: "textarea",
        label: "Description",
        placeholder: "Add description",
        colSpan: "col-span-12",
    },
];

export default fields;
