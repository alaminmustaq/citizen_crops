export default function fields(defaultForm) { 
    const transactionType = defaultForm.watch("transaction_type_ref");
    const recordId = defaultForm.watch("id"); // or get from props / context

    // Logic to disable transaction_type select based on both conditions
    const disableTransactionType = transactionType === "repeat" && !!recordId;
    console.log("Disable Transaction Type:", disableTransactionType);
    return [
        // Master record fields (match finance_records migration)
        {
            name: "financial_type",
            label: "Financial Type *",
            type: "select",
            options: [
                { label: "Income", value: "income" },
                { label: "Expense", value: "expense" },
            ],
            colSpan: "col-span-12 md:col-span-4",

            rules: {
                required: "Financial Type  is required",
            },
            handleChange: (e, form, filed) => {
                form?.setValue("financial_type", e.value);
                const data = defaultForm.watch(); // get all current form data

                // Destructure to remove `transaction_details`
                const { transaction_details, ...rest } = data;

                // Reset the form with remaining fields
                defaultForm.reset({
                    ...rest,
                    transaction_details: [],
                });
            },
        },
        
        {
            name: "project_id",
            type: "async-select",
            label: "Project",
            loadOptions: ["/projects", "projects", "projectTemplate"], 
            placeholder: "Select project",
            colSpan: "col-span-12 md:col-span-4",
        },
        {
            name: "transaction_type",
            label: "Transaction Type *",
            type: "select",
            colSpan: "col-span-12 md:col-span-4",
            options: [
                { label: "Regular", value: "regular" },
                { label: "Repeat", value: "repeat" },
                { label: "Future Payment", value: "future_payment" },
            ],
            disabled: disableTransactionType,
            rules: {
                required: "Transaction type is required",
            },
        }, 
        {
            name: "transaction_date",
            label: "Transaction Date *",
            type: "date",
            rules: {
                required: "Transaction date is required",
            },
            colSpan: "col-span-12 md:col-span-4",
        },
        {
            name: "expected_rec_pay_date",
            label: "Expected Receive Payment Date",
            type: "date",
            colSpan: "col-span-12 md:col-span-4",
        },

        {
            name: "bank_branch_id",
            label: "Bank Branch",
            type: "async-select",
            colSpan: "col-span-12 md:col-span-4",
            loadOptions: ["bank/banks", "banks", "bankTemplate"],
            handleChange: (e, form, field, allData) => {
                console.log("allData", e);

                allData.find((item) => {
                    if (item.value === e.value) {
                        form?.setValue("bank_id", item.bank_id);
                    }
                });
                form?.setValue("bank_branch_id", e);
            },
        },
        {
            name: "bank_transaction_number",
            label: "Bank Transaction Number",
            type: "text",
            colSpan: "col-span-12 md:col-span-4",
        },

        {
            name: "reference_remarks",
            label: "Reference / Remarks",
            type: "textarea",
        },

        // Details (match finance_record_details migration)

        {
            name: "transaction_details",
            type: "group-form",
            label: "Transaction Details",
            fields: [
                {
                    name: "employee_id",
                    type: "async-select",
                    label: "Select Employee *",
                    loadOptions: [
                        "hrm/employees",
                        "employees",
                        "employTemplate",
                    ],
                    placeholder: "Employees",
                    visibility:
                        defaultForm.watch("financial_type") === "expense",
                    colSpan: "col-span-12 sm:col-span-6 md:col-span-3",
                    rules: {
                        required: "Employ  is required",
                    },
                },
                {
                    name: "rec_payment_type_id",
                    type: "async-select",
                    label: "Expense/Income *",
                    type: "async-select",
                    colSpan: `col-span-6 ${defaultForm.watch("financial_type") === "expense"? 'md:col-span-2': 'md:col-span-4'} `,
                    loadOptions: [
                        "finance/rec-payment-types",
                        "items",
                        "receivePaymentTemplate",
                        "financial_type",
                    ],
                    placeholder: "Options",
                    rules: {
                        required: "Rec_pay_type  is required",
                    },
                },
                {
                    name: "amount",
                    type: "number",
                    label: "Add amount *",
                    placeholder: "Enter amount",
                    colSpan: `col-span-6 ${defaultForm.watch("financial_type") === "expense"? 'md:col-span-2': 'md:col-span-3'} `,
                    rules: {
                        required: "Amount is required",
                        min: { value: 1, message: "Amount must be at least 1" },
                    },
                },
                {
                    name: "description",
                    type: "textarea", 
                    label: "Description",
                    placeholder: "Enter description",
                    colSpan: "col-span-10 sm:col-span-6 md:col-span-4",
                    rows: 1, 
                },
            ],
            placeholder: "Optional",
            colSpan: "col-span-12",
        },
    ];
}
