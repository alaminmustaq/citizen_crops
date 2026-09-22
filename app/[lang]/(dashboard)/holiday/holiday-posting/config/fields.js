import useAuth from "@/domains/auth/hooks/useAuth";
import {
    branchSearchTemplate,
    departmentSearchTemplate,
} from "@/utility/templateHelper";

const fields = (form, actions) => {
    const { user } = useAuth();
    const roleLevel = user?.user?.roles?.[0]?.level ?? null;
    const level = Number(roleLevel);

    // console.log(user?.employee?.id);

    const currentUserType = form.watch("user_type");

    if (currentUserType !== "responsible") {
        form.setValue("user_type", "responsible", { shouldDirty: false });
    }

    const employee_user_type = form.watch("employee_user_type");

    if (employee_user_type !== "assigned") {
        form.setValue("employee_user_type", "assigned", { shouldDirty: false });
    }

    // const NotPaginate = form.watch("not_paginate");

    // if (!NotPaginate) {
    //     form.setValue("not_paginate", true, { shouldDirty: false });
    // }

    const isView = form.watch("mode") === "view"; // 🔑 detect view mode
    const isEdit = form.watch("mode") === "edit"; // 🔑 detect view mode

    // Prepare employee details load option
    let preparedLoadOptions = [];
    if (form.watch("model_for") == "delete_group_holiday") {
        preparedLoadOptions = [
            "holiday/holiday_posting", // URL
            "holidays", // dataKey in response
            // dataMapper function
            (holiday) => {
                const employee = holiday.employee || {};

                return {
                    id: holiday.id,
                    start_date:
                        actions.formatDateForForm(holiday.start_date) || "",
                    end_date: actions.formatDateForForm(holiday.end_date) || "",
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
                "branch_id",
                "start_date",
                "department_id",
                "end_date",
                "holiday_type_id",
                "type",
                "model_for",
                "status",
                // "not_paginate"
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
                "employee_type",
            ],
        ];
    }

    return [
        {
            name: "start_date",
            type: "date",
            label: "Start Date *",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
            rules: { required: "Start date is required" },
        },
        {
            name: "end_date",
            type: "date",
            label: "End Date *",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
            rules: {
                required: "End date is required",
                validate: (value) => {
                    const startDate = form.watch("start_date");
                    if (!startDate || !value) return true;

                    const startYear = new Date(startDate).getFullYear();
                    const endYear = new Date(value).getFullYear();

                    if (startYear !== endYear) {
                        return "Start date and end date must be in the same year";
                    }

                    if (new Date(value) < new Date(startDate)) {
                        return "End date cannot be before start date";
                    }

                    return true;
                },
            },
        },
        {
            name: "holiday_type_id",
            type: "async-select",
            label: "Holiday Type *",
            loadOptions: [
                "holiday/holiday_type",
                "holiday_types",
                "leaveTypeSearchTemplate",
            ],
            placeholder: "Select",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
            rules: { required: "Leave type is required" },
        },
        {
            name: "reason_id",
            type: "async-select",
            label: "Holiday Reason *",
            loadOptions: [
                "holiday/holiday_reason",
                "holiday_reasons",
                "leaveReasonSearchTemplate",
            ],
            lastChildren: [{ label: "Other", value: "other" }],
            placeholder: "Select",
            colSpan: "col-span-12 md:col-span-4",
            handleChange: (e) => {
                if (isView) return;
                form.setValue("reason_id", e);
                form.setValue("other_reason", "");
            },
            disabled: isView,
            visibility: form.watch("model_for") != "delete_group_holiday",
            rules: { required: "Leave reason is required" },
        },
        {
            name: "other_reason",
            type: "text",
            label: "Other Reason *",
            placeholder: "Enter other reason name",
            colSpan: "col-span-12 md:col-span-4",
            visibility: form?.watch("reason_id")?.value === "other",
            rules: { required: "Other reason is required" },
            disabled: isView,
        },
        {
            name: "type",
            type: "select",
            label: "Type *",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView || isEdit,
            options: [
                { label: "Company wise holiday", value: "company_holiday" },
                { label: "Project wise holiday", value: "project_holiday" },
            ],
            handleChange: (e) => {
                if (isView) return; // prevent changes in view mode
                form.setValue("type", e.value);
                form.setValue(
                    "branch_id",
                    branchSearchTemplate(
                        user?.employee?.branch ? [user?.employee?.branch] : [],
                    )?.at(0) ?? null,
                );
                form.setValue(
                    "department_id",
                    departmentSearchTemplate(
                        user?.employee?.department
                            ? [user?.employee?.department]
                            : [],
                    )?.at(0) ?? null,
                );
                console.log(user?.employee);

                form.setValue("employee_ids", null);
                form.setValue("project_id", null);
                if (e.value === "project_holiday") {
                    form.setValue("employee_id", user?.employee?.id);
                }
                if (form.watch("type") == "company_holiday") {
                    form.setValue("employee_type", "company");
                } else if (form.watch("type") == "project_holiday") {
                    form.setValue("employee_type", "project");
                }
            },
            rules: { required: "Type is required" },
        },
        {
            name: "branch_id",
            type: "async-select",
            label: "Branch *",
            visibility:
                form.watch("type") === "company_holiday" ||
                form.watch("type") === "project_holiday",
            loadOptions: [
                "organization/branches",
                "branches",
                "branchSearchTemplate",
            ],
            placeholder: "Select",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView || isEdit,
            rules: {
                validate: (value) => {
                    if (user?.employee?.branch && !value) {
                        return "Branch is required";
                    }
                    return true;
                },
            },
        },
        {
            name: "department_id",
            type: "async-select",
            label: `Department${user?.employee?.department ? " *" : ""}`,
            visibility: form.watch("type") === "company_holiday",
            loadOptions: [
                "organization/departments",
                "departments",
                "departmentSearchTemplate",
                ["branch_id", "type"],
            ],
            placeholder: "Optional",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView || isEdit,
            rules: {
                validate: (value) => {
                    if (user?.employee?.branch && !value) {
                        return "Branch is required";
                    }
                    return true;
                },
            },
        },
        {
            name: "project_id",
            type: "async-select",
            label: "Project",
            visibility: form.watch("type") === "project_holiday",
            loadOptions: [
                "projects",
                "projects",
                "projectTemplate",
                ["branch_id", "employee_id", "type", "user_type"],
            ],
            placeholder: "Optional",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView || isEdit,
        },
        {
            name: "status",
            type: "select",
            label: "Status *",
            colSpan: "col-span-12 md:col-span-4",
            options: [
                { label: "Approve", value: "approved" },
                { label: "Reject", value: "rejected" },
            ],
            visibility: form.watch("model_for") == "delete_group_holiday",
            rules: { required: "Status is required" },
        },
        {
            name: "process_button",
            type: "button",
            placeholder: "Process Holiday",
            colSpan: "col-span-12 md:col-span-4",
            disabled: isView,
            visibility:
                (form.watch("type") === "company_holiday" ||
                    form.watch("type") === "project_holiday") &&
                !isEdit,
            handleChange: (e, form) => {
                // Trigger the paginated component to load data
                // Use setTimeout to ensure component is mounted
                setTimeout(() => {
                    if (
                        form._paginatedLoaders &&
                        form._paginatedLoaders.employee_details
                    ) {
                        form._paginatedLoaders.employee_details();
                    } else {
                        console.warn(
                            "Paginated loader not found for employee_details",
                        );
                    }
                }, 100);
            },
        },
        {
            name: "note",
            type: "textarea",
            label: "Notes",
            placeholder: "Optional notes",
            colSpan: "col-span-12",
            rules: { maxLength: { value: 500, message: "Max 500 characters" } },
            disabled: isView,
            visibility: form.watch("model_for") != "delete_group_holiday",
        },

        // ===== Dynamic Employee Details with Pagination =====
        {
            name: "employee_details",
            type: "group-form-paginated",
            label: "Employee Details (Check to exclude employee from holiday)",
            colSpan: "col-span-12",
            addButtonLabel: false,
            isDelete: false,
            maxHeight: "400px",
            loadMoreLabel: "Load More Employees",
            perPage: 10,
            autoLoad: false, // Will be triggered by Process button
            enableSearch: true,
            searchPlaceholder: "Search employees by name, email, or phone...",

            visibility:
                (form.watch("type") === "company_holiday" ||
                    form.watch("type") === "project_holiday") &&
                !isEdit,
            loadOptions: preparedLoadOptions,
            fields: [
                {
                    name: "is_selected",
                    type: "checkbox",
                    label: "Select",
                    colSpan: "col-span-12 md:col-span-1",
                    disabled: isView,
                },
                {
                    name: "employee_name",
                    type: "text",
                    label: "Employee Name",
                    colSpan: `col-span-12 ${
                        form.watch("model_for") == "approve_single_leave"
                            ? "md:col-span-2"
                            : "md:col-span-4"
                    }`,
                    disabled: true,
                },
                {
                    name: "start_date",
                    type: "date",
                    label: "Start Date",
                    colSpan: "col-span-12 md:col-span-2",
                    disabled: true,
                    visibility:
                        form.watch("model_for") == "approve_single_leave",
                },
                {
                    name: "end_date",
                    type: "date",
                    label: "End Date",
                    colSpan: "col-span-12 md:col-span-2",
                    disabled: true,
                    visibility:
                        form.watch("model_for") == "approve_single_leave",
                },
                {
                    name: "employee_id",
                    type: "text",
                    label: "Employee ID",
                    colSpan: "col-span-12 md:col-span-6",
                    disabled: true,
                    visibility: false,
                },
                {
                    name: "employee_code",
                    type: "text",
                    label: "Employee Code",
                    colSpan: "col-span-12 md:col-span-4",
                    disabled: true,
                    visibility:
                        form.watch("model_for") != "approve_single_leave",
                },
                {
                    name: "employee_phone",
                    type: "text",
                    label: "Employee Phone",
                    colSpan: `col-span-12 ${
                        form.watch("model_for") == "approve_single_leave"
                            ? "md:col-span-2"
                            : "md:col-span-3"
                    }`,
                    disabled: true,
                },
            ],
        },
    ];
};

export default fields;
