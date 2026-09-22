import useAuth from "@/domains/auth/hooks/useAuth";
import { branchSearchTemplate } from "@/utility/templateHelper";
const leaveDetailsReportFilters = (form) => {
    const { user } = useAuth();
    const roleLevel = user?.user?.roles?.[0]?.level ?? null;
    const level = Number(roleLevel);

    const isAssignedToProject = user?.isAssignedToProject === true;
    const isResponsibleForProject = user?.isResponsibleForProject === true;

    const isEmployee = user?.employee && level === 3;
    

    // console.log(user?.employee?.id);

    const isView = form.watch("mode") === "view"; // 🔑 detect view mode
    const isEdit = form.watch("mode") === "edit"; // 🔑 detect view mode

    // Prepare employee details load option
    let preparedLoadOptions = [];
    if (form.watch("model_for") == "delete_group_leave") {
        preparedLoadOptions = [
            "holiday/holiday_posting", // URL
            "holiday_posting", // dataKey in response
            // dataMapper function
            (leave) => {
                const employee = leave.employee || {};

                return {
                    id: leave.id,
                    start_date:
                        actions.formatDateForForm(leave.start_date) || "",
                    end_date: actions.formatDateForForm(leave.end_date) || "",
                    employee_name:
                        [employee.first_name || "", employee.last_name || ""]
                            .join(" ")
                            .trim() || "Unknown",
                    employee_code: employee.employee_code || "N/A",
                    employee_phone:
                        employee.primary_phone ||
                        employee.contact_info?.primary_phone ||
                        "",
                };
            },
            // filterFields - fields to use as filters from form
            [
                "project_id",
                "start_date",
                "department_id",
                "end_date",
                "leave_type_id",
                "type",
                "model_for",
            ],
        ];
    } else {
        preparedLoadOptions = [
            "hrm/employees", // URL
            "employees", // dataKey in response
            // dataMapper function
            (employee) => ({
                id: employee.id,
                employee_name:
                    employee.personal_info?.full_name ||
                    `${employee.personal_info?.first_name || ""} ${
                        employee.personal_info?.last_name || ""
                    }`.trim() ||
                    employee.first_name ||
                    "Unknown",
                employee_email:
                    employee.contact_info?.work_email ||
                    employee.contact_info?.primary_email ||
                    employee.work_email ||
                    "",
                employee_phone:
                    employee.contact_info?.primary_phone ||
                    employee.primary_phone ||
                    "",
            }),
            // filterFields - fields to use as filters from form
            [
                "branch_id",
                `${
                    form.watch("type") == "company_holiday"
                        ? "department_id"
                        : "project_id"
                }`,
            ],
        ];
    }

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
            disabled: isView,
        },
        // {
        //     name: "type",
        //     type: "select",
        //     label: "Type",
        //     colSpan: "col-span-12 md:col-span-4",
        //     disabled: isView || isEdit,
        //     options: [
        //         { label: "Company wise holiday", value: "company_holiday" },
        //         { label: "Project wise holiday", value: "project_holiday" },
        //     ],
        //     handleChange: (e) => {
        //         if (isView) return; // prevent changes in view mode
        //         form.setValue("type", e.value);
        //         form.setValue(
        //             "branch_id",
        //             branchSearchTemplate(
        //                 user?.employee?.branch ? [user?.employee?.branch] : []
        //             )?.at(0) ?? null
        //         );
        //         form.setValue("department_id", null);
        //         form.setValue("employee_ids", null);
        //         form.setValue("project_id", null);
        //         if (e.value === "project_holiday") {
        //             form.setValue("employee_id", user?.employee?.id);
        //         }
        //     },
        // },

    ];
};

export default leaveDetailsReportFilters;
