export default function futurePaymentField(defaultForm) {
    return [
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
            name: "total_amount",
            label: "Total Amount",
          
            disabled: true,
            type: "text",
            colSpan: "col-span-12 md:col-span-4",
        },

        {
            name: "reference_remarks",
            label: "Reference / Remarks",
            type: "textarea",
        },
    ];
}
