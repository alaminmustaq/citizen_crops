import useAuth from "@/domains/auth/hooks/useAuth";
import { branchSearchTemplate,departmentSearchTemplate } from "@/utility/templateHelper";

const fields = (actions,form) => {
    const isView = form.watch("mode") === "view"; // 🔑 detect view mode
    const isEdit = form.watch("mode") === "edit"; // 🔑 detect edit mode

    const { user } = useAuth();
    return [
        {
            name: "type",
            type: "select",
            label: "Type *",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
            options: [
                { label: "Company", value: "company" },
                { label: "Project", value: "project" },
            ],
            handleChange: (e) => { 
                form.setValue("type", e.value);
                form.setValue(
                    "branch_id",
                    branchSearchTemplate(
                        user?.employee?.branch ? [user?.employee?.branch] : []
                    )?.at(0) ?? null
                );
                form.setValue(
                    "department_id",
                    departmentSearchTemplate(
                        user?.employee?.department ? [user?.employee?.department] : []
                    )?.at(0) ?? null
                );
                form.setValue("project_id", null);   
            }
        },
        // ===== Company =====
        {
            name: "branch_id",
            type: "async-select",
            label: `Branch ${form.watch("type") === "project" ? "*" : ""}`,
            colSpan: "col-span-12 md:col-span-4",
            visibility:
                form.watch("type") === "company" ||
                form.watch("type") === "project",
            disabled: isView,
            loadOptions: [
                "organization/branches",
                "branches",
                "branchSearchTemplate",
            ],
            rules: {
                required:
                    form.watch("type") === "project"
                        ? "Branch is required"
                        : false,
            },
        },
        {
            name: "department_id",
            type: "async-select",
            label: "Department",
            colSpan: "col-span-12 md:col-span-4",
            visibility: form.watch('type') == "company",
            disabled: isView,
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
            label: "Project *",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
            visibility: form.watch('type') == "project",
            loadOptions: ["projects", "projects", "projectTemplate","branch_id"],
            rules: { required: "Project is required" }
        }, 
        {
            name: "employee_type_id",
            type: "async-select",
            label: "Employee Type *",
            disabled: isView,
            colSpan: "col-span-12 md:col-span-4",
            loadOptions: [
                "schedule/employee_type",
                "employee_types",
                "employeeTypeSearchTemplate",
            ], 
            rules: { required: "Employee type is required" }
        },

        {
            name: "shift_id",
            type: "async-select",
            label: "Shift *",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
            // loadOptions: ["shifts", "shifts", "shiftTemplate"],
            loadOptions: [
                "schedule/employee_shift",
                "employee_shifts",
                "shiftSearchTemplate",
            ],
            rules: { required: "Shift is required" }
        }, 

        {
            name: "in_time",
            type: "date",
            inputProps: { type: "time" },
            label: "In Time *",
            disabled: isView,
            colSpan: "col-span-12 md:col-span-4",
            rules: { required: "In time is required" }
        },
        {
            name: "late_time",
            type: "date",
            inputProps: { type: "time" },
            disabled: isView,
            label: "Late Time *",
            colSpan: "col-span-12 md:col-span-4",
            rules: { required: "Late time is required" }
        },
        {
            name: "last_in_time",
            type: "date",
            inputProps: { type: "time" },
            disabled: isView,
            label: "Last In Time *",
            colSpan: "col-span-12 md:col-span-4",
            rules: { required: "Last in time is required" }
        }, 
        {
            name: "break_time_start",
            type: "date",
            inputProps: { type: "time" },
            disabled: isView,
            label: "Break Time Start",
            colSpan: "col-span-12 md:col-span-4", 
        },
        {
            name: "break_time_end",
            type: "date",
            inputProps: { type: "time" },
            disabled: isView,
            label: "Break Time End",
            colSpan: "col-span-12 md:col-span-4",
        },
        {
            name: "out_time",
            type: "date",
            inputProps: { type: "time" },
            disabled: isView,
            label: "Out Time *",
            colSpan: "col-span-12 md:col-span-4",
            rules: { required: "Out time is required" }
        },    
        {
            name: "overtime_status",
            type: "select",
            label: "Overtime Status *",
            disabled: isView,
            colSpan: "col-span-12 md:col-span-4",
            options: [
                { label: "Enabled", value: true },
                { label: "Disabled", value: false },
            ],
            rules: { required: "Overtime status is required" }
        }, 
    ];
};

export default fields;
