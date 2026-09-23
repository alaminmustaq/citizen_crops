import { useCompany } from "@/domains/company/hook/useCompany";
import { useDepartment } from "@/domains/department/hook/useDepartment";


const fields = () => {
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
            placeholder: "Optional",
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
            ],
            placeholder: "Optional",
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
        {
            name: "hierarchy_level",
            type: "number",
            label: "Hierarchy Level",
            placeholder: "1",
            colSpan: "col-span-12 md:col-span-4",
            inputProps: { min: 1, step: "1" },
            rules: { min: { value: 1, message: "Must be ≥ 1" } },
        },
        {
            name: "hierarchy_path",
            type: "input",
            label: "Hierarchy Path",
            placeholder: "e.g., CEO/VP/Manager",
            colSpan: "col-span-12 md:col-span-4",
            inputProps: { maxLength: 500 },
            rules: { maxLength: { value: 500, message: "Max 500 characters" } },
        },

        // ============= Core Info =============
        {
            name: "title",
            type: "input",
            label: "Job Title *",
            placeholder: "Job title",
            colSpan: "col-span-12 md:col-span-4",
            rules: {
                required: "Title is required",
                maxLength: { value: 200, message: "Max 200 characters" },
            },
            inputProps: { maxLength: 200 },
        },
        {
            name: "code",
            type: "input",
            label: "Position Code *",
            placeholder: "ENG-001",
            colSpan: "col-span-12 md:col-span-4",
            rules: {
                required: "Code is required",
                maxLength: { value: 50, message: "Max 50 characters" },
            },
            inputProps: { maxLength: 50 },
        },
        {
            name: "description",
            type: "textarea",
            label: "Description",
            placeholder: "Overview of the position...",
            colSpan: "col-span-12",
        },
        {
            name: "responsibilities",
            type: "textarea",
            label: "Responsibilities",
            placeholder: "Key duties and responsibilities...",
            colSpan: "col-span-12 md:col-span-6",
        },
        {
            name: "requirements",
            type: "textarea",
            label: "Requirements",
            placeholder: "Required qualifications, skills, experience...",
            colSpan: "col-span-12 md:col-span-6",
        },
        
        // ============= Classification =============
        {
            name: "employment_type",
            type: "select",
            label: "Employment Type *",
            colSpan: "col-span-12 md:col-span-4",
            options: [
                { label: "Full Time", value: "full_time" },
                { label: "Part Time", value: "part_time" },
                { label: "Casual", value: "casual" },
                { label: "Seasonal", value: "seasonal" },
                { label: "Internship", value: "internship" },
            ],
            rules: { required: "Employment type is required" },
        },
        {
            name: "job_category",
            type: "select",
            label: "Job Category *",
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
            rules: { required: "Category is required" },
        },
        {
            name: "job_level",
            type: "select",
            label: "Job Level *",
            colSpan: "col-span-12 md:col-span-4",
            options: [
                { label: "Intern", value: "intern" },
                { label: "Junior", value: "junior" },
                { label: "Mid", value: "mid" },
                { label: "Senior", value: "senior" },
                { label: "Lead", value: "lead" },
                { label: "Manager", value: "manager" },
                { label: "Director", value: "director" },
                { label: "VP", value: "vp" },
                { label: "Executive", value: "executive" },
            ],
            rules: { required: "Job Level type is required" },
        },
        // {
        //     name: "experience_required",
        //     type: "input",
        //     label: "Experience Required",
        //     placeholder: "e.g., 2-5 years",
        //     colSpan: "col-span-12 md:col-span-4",
        //     inputProps: { maxLength: 50 },
        //     rules: { maxLength: { value: 50, message: "Max 50 characters" } },
        // },
        // {
        //     name: "education_required",
        //     type: "textarea",
        //     label: "Required Education",
        //     placeholder: "e.g., Bachelor's degree in Computer Science",
        //     colSpan: "col-span-12 md:col-span-6",
        // },
        // {
        //     name: "education_preferred",
        //     type: "textarea",
        //     label: "Preferred Education",
        //     placeholder: "e.g., Master's degree in Business Administration",
        //     colSpan: "col-span-12 md:col-span-6",
        // },
        
        // ============= Salary & Compensation =============
        // {
        //     name: "min_salary",
        //     type: "number",
        //     label: "Minimum Salary",
        //     placeholder: "50000.00",
        //     colSpan: "col-span-12 md:col-span-4",
        //     inputProps: { min: 0, step: "0.01" },
        //     rules: { min: { value: 0, message: "Must be ≥ 0" } },
        // },
        // {
        //     name: "max_salary",
        //     type: "number",
        //     label: "Basic Salary",
        //     placeholder: "90000.00",
        //     colSpan: "col-span-12 md:col-span-4",
        //     inputProps: { min: 0, step: "0.01" },
        //     rules: { min: { value: 0, message: "Must be ≥ 0" } },
        // },
        // {
        //     name: "currency",
        //     type: "input",
        //     label: "Salary Currency *",
        //     placeholder: "USD",
        //     colSpan: "col-span-12 md:col-span-4",
        //     rules: {
        //         required: "Currency is required",
        //         maxLength: { value: 3, message: "Max 3 characters" },
        //     },
        //     inputProps: { maxLength: 3 },
        // },
        // {
        //     name: "salary_type",
        //     type: "select",
        //     label: "Salary Type *",
        //     colSpan: "col-span-12 md:col-span-4",
        //     options: [
        //         { label: "Hourly", value: "hourly" },
        //         { label: "Daily", value: "daily" },
        //         { label: "Weekly", value: "weekly" },
        //         { label: "Monthly", value: "monthly" },
        //         { label: "Yearly", value: "yearly" },
        //         { label: "Annual", value: "annual" },
        //     ],
        //     rules: { required: "Salary type is required" },
        // },
        // {
        //     name: "bonus_eligible",
        //     type: "checkbox",
        //     label: "Bonus Eligible",
        //     colSpan: "col-span-12 md:col-span-4",
        // },
        // {
        //     name: "commission_eligible",
        //     type: "checkbox",
        //     label: "Commission Eligible",
        //     colSpan: "col-span-12 md:col-span-4",
        // },
        
        // ============= Skills & Experience =============
        // {
        //     name: "required_skills",
        //     type: "textarea",
        //     label: "Required Skills",
        //     placeholder: "Must-have skills…",
        //     colSpan: "col-span-12 md:col-span-6",
        // },
        // {
        //     name: "preferred_skills",
        //     type: "textarea",
        //     label: "Preferred Skills",
        //     placeholder: "Nice-to-have skills…",
        //     colSpan: "col-span-12 md:col-span-6",
        // },
        {
            name: "education_level",
            type: "input",
            label: "Education Level",
            placeholder: "Bachelor's degree, etc.",
            colSpan: "col-span-12 md:col-span-4",
            inputProps: { maxLength: 100 },
            rules: { maxLength: { value: 100, message: "Max 100 characters" } },
        },
        {
            name: "experience_years_min",
            type: "number",
            label: "Minimum Experience (Years) *",
            placeholder: "0",
            colSpan: "col-span-12 md:col-span-4",
            rules: {
                required: "Minimum experience is required",
                min: { value: 0, message: "Must be ≥ 0" },
            },
            inputProps: { min: 0, step: "1" },
        },
        {
            name: "experience_years_max",
            type: "number",
            label: "Maximum Experience (Years)",
            placeholder: "10",
            colSpan: "col-span-12 md:col-span-4",
            rules: {
                min: { value: 0, message: "Must be ≥ 0" },
                validate: (value, formValues) => {
                    if (!value || !formValues.experience_years_min) return true;

                    return Number(value) >= Number(formValues.experience_years_min)
                        || "Maximum experience cannot be less than minimum experience";
                }
            },
            inputProps: { min: 0, step: "1" },
        },
        
        // ============= Work Style & Recruitment =============
        {
            name: "travel_requirement",
            type: "input",
            label: "Travel Requirement",
            placeholder: "e.g., 25%",
            colSpan: "col-span-12 md:col-span-4",
            inputProps: { maxLength: 10 },
            rules: { maxLength: { value: 10, message: "Max 10 characters" } },
        },
        // {
        //     name: "remote_work_allowed",
        //     type: "checkbox",
        //     label: "Remote Work Allowed",
        //     colSpan: "col-span-12 md:col-span-4",
        // },
        // {
        //     name: "overtime_eligible",
        //     type: "checkbox",
        //     label: "Overtime Eligible",
        //     colSpan: "col-span-12 md:col-span-4",
        // },
        {
            name: "total_positions",
            type: "number",
            label: "Total Positions *",
            placeholder: "1",
            colSpan: "col-span-12 md:col-span-4",
            rules: {
                required: "Total positions is required",
                min: { value: 1, message: "Must be ≥ 1" },
            },
            inputProps: { min: 1, step: "1" },
        },
        {
            name: "filled_positions",
            type: "number",
            label: "Filled Positions *",
            placeholder: "0",
            colSpan: "col-span-12 md:col-span-4",
            rules: {
                required: "Filled positions is required",
                min: { value: 0, message: "Must be ≥ 0" },
                validate: (value, formValues) => {
                    if (!value || !formValues.total_positions) return true;

                    return Number(value) <= Number(formValues.total_positions)
                        || "Filled positions cannot be greater than total positions";
                }
            },
            inputProps: { min: 0, step: "1" },
        },
        {
            name: "vacant_positions",
            type: "number",
            label: "Vacant Positions *",
            placeholder: "1",
            colSpan: "col-span-12 md:col-span-4",
            rules: {
                required: "Vacant positions is required",
                min: { value: 0, message: "Must be ≥ 0" },
                validate: (value, formValues) => {
                    const total = Number(formValues.total_positions);
                    const filled = Number(formValues.filled_positions);

                    if (!total || filled < 0) return true;

                    const expectedVacant = total - filled;

                    return Number(value) === expectedVacant
                        || `Vacant positions must be ${expectedVacant}`;
                }
            },
            inputProps: { min: 0, step: "1" },
        },
        {
            name: "is_recruiting",
            type: "checkbox",
            label: "Currently Recruiting",
            colSpan: "col-span-12 md:col-span-4",
        },
        // {
        //     name: "recruitment_status",
        //     type: "select",
        //     label: "Recruitment Status *",
        //     colSpan: "col-span-12 md:col-span-4",
        //     options: [
        //         { label: "Not Recruiting", value: "not_recruiting" },
        //         { label: "Actively Recruiting", value: "actively_recruiting" },
        //         { label: "On Hold", value: "on_hold" },
        //         { label: "Filled", value: "filled" },
        //     ],
        //     rules: { required: "Recruitment status is required" },
        // },
        // {
        //     name: "posting_date",
        //     type: "date",
        //     label: "Posting Date",
        //     colSpan: "col-span-12 md:col-span-4",
        // },
        // {
        //     name: "application_deadline",
        //     type: "date",
        //     label: "Application Deadline",
        //     colSpan: "col-span-12 md:col-span-4",
        // },
        // {
        //     name: "benefits",
        //     type: "textarea",
        //     label: "Benefits",
        //     placeholder: "List of benefits...",
        //     colSpan: "col-span-12",
        // },
        
        // ============= Operational & Metadata =============
        {
            name: "status",
            type: "select",
            label: "Status *",
            colSpan: "col-span-12 md:col-span-4",
            options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "On Hold", value: "on_hold" },
                { label: "Discontinued", value: "discontinued" },
            ],
            rules: { required: "Status is required" },
        },
        // {
        //     name: "is_enabled",
        //     type: "checkbox",
        //     label: "Enabled",
        //     colSpan: "col-span-12 md:col-span-4",
        // },
        
    ];
};

export default fields;
