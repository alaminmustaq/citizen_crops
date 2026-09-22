// import useAuth from "@/domains/auth/hooks/useAuth";
import { branchSearchTemplate,departmentSearchTemplate } from "@/utility/templateHelper";

const filterFields  = (form, actions) => {
  

    return [
       {
            name: "start_date",
            type: "date",
            label: "Start Date",
            colSpan: "col-span-12 md:col-span-3",
        },
        {
            name: "end_date",
            type: "date",
            label: "End Date",
            colSpan: "col-span-12 md:col-span-3",
            rules: {
                validate: (value, form) => {
                    if (form.start_date && value) {
                        return (
                            new Date(form.start_date) <= new Date(value) ||
                            "Start date cannot be Before end date"
                        );
                    }
                    return true;
                },
            },
        },
        {
            name: "employee_ids",
            type: "multi-async-select",
            label: "Employee",
            loadOptions: ["hrm/employees", "employees", "employTemplate"],
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
            colSpan: "col-span-12 md:col-span-3",
        },
        {
            name: "department_id",
            type: "async-select",
            label: "Department",
            loadOptions: [
                "organization/departments",
                "departments",
                "departmentSearchTemplate",
                "branch_id",
            ],
            colSpan: "col-span-12 md:col-span-3",
        },
        {
            name: "project_id",
            type: "async-select",
            label: "Project",
            loadOptions: ["projects", "projects", "projectTemplate"],
            colSpan: "col-span-12 md:col-span-3",
        },
        {
            name: "holiday_type_id",
            type: "async-select",
            label: "Holiday Type",
            loadOptions: [
                "holiday/holiday_type",
                "holiday_types",
                "leaveTypeSearchTemplate",
            ],
            placeholder: "Select",
            colSpan: "col-span-12 md:col-span-4",
            
        },

      
    ];
};

export default filterFields;
