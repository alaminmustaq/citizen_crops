
const fields = (form) => [
    {
        name: "date_from",
        type: "date",
        label: "From Date",
        colSpan: "col-span-12 md:col-span-3",
    },

    {
        name: "date_to",
        type: "date",
        label: "To Date",
        colSpan: "col-span-12 md:col-span-3",
    },
    {
        name: "financial_type",
        label: "Financial Type",
        type: "select",
        options: [
            { label: "Income", value: "income" },
            { label: "Expense", value: "expense" },
        ],
        colSpan: "col-span-12 md:col-span-3", 
    },

    {
        name: "project_id",
        type: "async-select",
        label: "Project",
        loadOptions: ["/projects", "projects", "projectTemplate"], 
        placeholder: "Select project",
        colSpan: "col-span-12 md:col-span-3",
    },

    {
        name: "transaction_type",
        label: "Transaction Type",
        type: "select",
        colSpan: "col-span-12 md:col-span-3",
        options: [
            { label: "Regular", value: "regular" },
            { label: "Repeat", value: "repeat" },
            { label: "Future Payment", value: "future_payment" },
        ],  
    }, 

    {
        name: "bank_branch_id",
        label: "Bank Branch",
        type: "async-select",
        colSpan: "col-span-12 md:col-span-3",
        loadOptions: ["bank/banks", "banks", "bankTemplate"],
        handleChange: (e, form, field, allData) => { 
            allData.find((item) => {
                if (item.value === e.value) {
                    form?.setValue("bank_id", item.bank_id);
                }
            });
            form?.setValue("bank_branch_id", e);
        },
    },
    {
        name: "rec_payment_type_id",
        type: "async-select",
        label: "Expense/Income",
        type: "async-select",
        colSpan: `col-span-6 md:col-span-3`,
        loadOptions: [
            "finance/rec-payment-types",
            "items",
            "receivePaymentTemplate",
            "financial_type",
        ],
        placeholder: "Options", 
    },  
    {
        name: "employee_ids",
        type: "multi-async-select",
        label: "Employees",
        visibility:form.watch("financial_type") === "expense",
        loadOptions: ["hrm/employees", "employees", "employTemplate"], 
        colSpan: "col-span-12 md:col-span-3", 
    },  
];

export default fields;