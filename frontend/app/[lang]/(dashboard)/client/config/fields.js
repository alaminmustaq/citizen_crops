const clientFields = () => {
    return [
        // =============== Core ===============
        {
            name: "name",
            type: "input",
            label: "Client Name *",
            placeholder: "Enter client name",
            colSpan: "col-span-12 md:col-span-6",
            rules: {
                required: "Client Name is required",
                maxLength: { value: 200, message: "Max 200 characters" },
            },
            inputProps: { maxLength: 200 },
        },
        {
            name: "email",
            type: "email",
            label: "Email *",
            placeholder: "cliente@exemplo.com",
            colSpan: "col-span-12 md:col-span-6",
            rules: {
                required: "Email is required",
                maxLength: { value: 100, message: "Max 100 characters" },
            },
            inputProps: { maxLength: 100 },
        },
        {
            name: "phone",
            type: "input",
            label: "Phone",
            placeholder: "(+351) 123 456 789",
            colSpan: "col-span-12 md:col-span-6",
            inputProps: { maxLength: 50 },
        },
        {
            name: "client_type",
            type: "select",
            label: "Client Type *",
            placeholder: "Select client type",
            colSpan: "col-span-12 md:col-span-6",
            options: [
                { label: "Individual", value: "individual" },
                { label: "Business", value: "business" },
            ],
        },
        {
            name: "tax_id",
            type: "input",
            label: "Tax ID",
            placeholder: "123456789",
            colSpan: "col-span-12 md:col-span-6",
            inputProps: { maxLength: 50 },
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
        },
        {
            name: "address",
            type: "textarea",
            label: "Address",
            placeholder: "Enter address",
            colSpan: "col-span-12",
        },
        {
            name: "observations",
            type: "textarea",
            label: "Observations",
            placeholder: "Additional information...",
            colSpan: "col-span-12",
        },
    ];
  };
  
  export default clientFields;
  