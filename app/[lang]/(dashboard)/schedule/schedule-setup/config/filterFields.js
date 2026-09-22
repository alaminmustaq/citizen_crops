
const filterFields = (actions,form) => {
   
    return [
        {
            name: "type",
            type: "select",
            label: "Type",
            colSpan: "col-span-12 md:col-span-4",
            // disabled: isView,
            options: [
                { label: "Company", value: "company" },
                { label: "Project", value: "project" },
            ],
           
        },
        // ===== Company =====
        {
            name: "branch_id",
            type: "async-select",
            label: "Branch",
            colSpan: "col-span-12 md:col-span-4",
            // visibility:
            //     form.watch("type") === "company" ||
            //     form.watch("type") === "project",
            // disabled: isView,
            loadOptions: [
                "organization/branches",
                "branches",
                "branchSearchTemplate",
            ],
            // rules: {
            //     required:
            //         form.watch("type") === "project"
            //             ? "Branch is required"
            //             : false,
            // },
        },
        {
            name: "department_id",
            type: "async-select",
            label: "Department",
            colSpan: "col-span-12 md:col-span-4",
            // visibility: form.watch('type') == "company",
            // disabled: isView,
            loadOptions: [
                "organization/departments",
                "departments",
                "departmentSearchTemplate",
                "branch_id"
            ],
        }, 
        {
            name: "project_id",
            type: "async-select",
            label: "Project",
            colSpan: "col-span-12 md:col-span-4",
            // disabled: isView,
            // visibility: form.watch('type') == "project",
            loadOptions: ["projects", "projects", "projectTemplate","branch_id"],
            // rules: { required: "Project is required" }
        }, 
        {
            name: "employee_type_id",
            type: "async-select",
            label: "Employee Type",
            // disabled: isView,
            colSpan: "col-span-12 md:col-span-4",
            loadOptions: [
                "schedule/employee_type",
                "employee_types",
                "employeeTypeSearchTemplate",
            ], 
            // rules: { required: "Employee type is required" }
        },

        {
            name: "shift_id",
            type: "async-select",
            label: "Shift",
            colSpan: "col-span-12 md:col-span-4",
            // disabled: isView,
            // loadOptions: ["shifts", "shifts", "shiftTemplate"],
            loadOptions: [
                "schedule/employee_shift",
                "employee_shifts",
                "shiftSearchTemplate",
            ],
           
        }, 

    ];
};

export default filterFields;
