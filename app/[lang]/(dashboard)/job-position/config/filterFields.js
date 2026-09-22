import { useCompany } from "@/domains/company/hook/useCompany";
import { useDepartment } from "@/domains/department/hook/useDepartment";

const filterFields = () => {
    // Hooks to get search actions for async selects
    // const { actions: companyActions } = useCompany();
    // const { actions: departmentActions } = useDepartment();
    // const { actions: jobPositionActions } = useJobPosition();
    // const { actions: branchActions } = useBranch();
    // const { actions: userActions } = useUser();

    return [
        // ============= Relations =============

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
            colSpan: "col-span-12 md:col-span-4",
        },
        // {
        //     name: "reports_to_position_id",
        //     type: "async-select",
        //     label: "Reports To (Position)",
        //     loadOptions: [
        //         "organization/job-positions",
        //         "job_positions",
        //         "jobPositionSearchTemplate",
        //     ],
        //     placeholder: "Optional",
        //     colSpan: "col-span-12 md:col-span-4",
        // },
        // {
        //     name: "manager_id",
        //     type: "async-select",
        //     label: "Manager",
        //     loadOptions: ["auth/users", "users", "userSearchTemplate"],
        //     placeholder: "Optional",
        //     colSpan: "col-span-12 md:col-span-4",
        // },

        // ============= Core Info =============
     
      
        // ============= Classification =============
        {
        name: "employee_type_id",
        type: "async-select",
        label: "Employee Type",
        colSpan: "col-span-12 md:col-span-4",
        loadOptions: [
            "schedule/employee_type",
            "employee_types",
            "employeeTypeSearchTemplate",
        ],
    },
        {
            name: "job_category",
            type: "select",
            label: "Job Category",
            colSpan: "col-span-12 md:col-span-4",
            options: [
                { label: "Executive", value: "executive" },
                { label: "Management", value: "management" },
                { label: "Senior", value: "senior" },
                { label: "Mid Level", value: "mid_level" },
                { label: "Junior", value: "junior" },
                { label: "Entry Level", value: "entry_level" },
                { label: "Engineering", value: "engineering" },
                { label: "Sales", value: "sales" },
                { label: "Marketing", value: "marketing" },
                { label: "HR", value: "hr" },
                { label: "Finance", value: "finance" },
                { label: "Operations", value: "operations" },
            ],

        },
        // ============= Operational & Metadata =============
        {
            name: "status",
            type: "select",
            label: "Status",
            colSpan: "col-span-12 md:col-span-4",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
            ],
            
        },
        // {
        //     name: "is_enabled",
        //     type: "checkbox",
        //     label: "Enabled",
        //     colSpan: "col-span-12 md:col-span-4",
        // },
    ];
};

export default filterFields;
