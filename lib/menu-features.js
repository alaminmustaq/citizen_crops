export const isBreakFeatureEnabled = (featureSettings) => {
    if (!featureSettings) return true;
    const val =
        featureSettings?.data?.features?.attendance?.break ??
        featureSettings?.features?.attendance?.break ??
        featureSettings?.data?.attendance?.break;
    if (val === undefined || val === null) return true;
    return val === true || val === "1" || val === 1 || val === "true";
};

export const isProjectFeatureEnabled = (featureSettings) => {
    if (!featureSettings) return true;
    const val =
        featureSettings?.data?.features?.project?.project ??
        featureSettings?.features?.project?.project ??
        featureSettings?.data?.project?.project;
    if (val === undefined || val === null) return true;
    return val !== false && val !== "0" && val !== 0 && val !== "false";
};

export const isSalaryApprovalFeatureEnabled = (featureSettings) => {
    if (!featureSettings) return true;
    const val =
        featureSettings?.data?.features?.salary?.salary_approval ??
        featureSettings?.features?.salary?.salary_approval ??
        featureSettings?.data?.salary?.salary_approval;
    if (val === undefined || val === null) return true;
    return val === true || val === "1" || val === 1 || val === "true";
};

export const isPartialPaymentFeatureEnabled = (featureSettings) => {
    if (!featureSettings) return true;
    const val =
        featureSettings?.data?.features?.salary?.partial_payment ??
        featureSettings?.features?.salary?.partial_payment ??
        featureSettings?.data?.salary?.partial_payment;
    if (val === undefined || val === null) return true;
    return val === true || val === "1" || val === 1 || val === "true";
};

export const projectFeatureResourceNames = [
    "project",
    "project_id",
    "displayProject",
    "project_name",
    "tool",
    "tool_id",
    "tool-distribution",
    "tool-damage",
];

export const filterProjectFeatureItems = (items = [], projectEnabled = true) => {
    if (projectEnabled) {
        return items;
    }

    return items
        .map((item) => {
            if (!item) {
                return item;
            }

            const key = item.name ?? item.accessorKey ?? item.id;
            if (projectFeatureResourceNames.includes(key)) {
                return null;
            }

            if (Array.isArray(item.options)) {
                return {
                    ...item,
                    options: item.options.filter(
                        (option) => option?.value !== "project" && option?.value !== "project_attendance",
                    ),
                };
            }

            return item;
        })
        .filter(Boolean);
};

export const enforceProjectFeatureFormState = (form, projectEnabled = true) => {
    if (!form || projectEnabled) {
        return;
    }

    if (form.getValues("project_id")) {
        form.setValue("project_id", null);
    }

    if (form.getValues("scope_type") === "project") {
        form.setValue("scope_type", "company");
        form.setValue("employee_type", "company");
    }

    if (form.getValues("attendance_type") === "project_attendance") {
        form.setValue("attendance_type", "company_attendance");
    }

    if (form.getValues("type") === "project") {
        form.setValue("type", "company");
    }
};

export const filterMenusByPermissionAndFeatures = (
    menus = [],
    user,
    featureSettings,
) => {
    const breakEnabled = isBreakFeatureEnabled(featureSettings);
    const projectEnabled = isProjectFeatureEnabled(featureSettings);
    const partialPaymentEnabled = isPartialPaymentFeatureEnabled(featureSettings);

    const userPerms = (user?.permissions || []).map((p) =>
        typeof p === "string" ? p : p?.name,
    );

    const isCompanyOrSuperUser =
        user?.is_super_admin ||
        user?.is_company ||
        user?.user_type === "company" ||
        user?.role === "company" ||
        user?.role === "super_admin" ||
        user?.role === "root_admin" ||
        user?.role === "admin" ||
        (user?.company_id && (!user?.permissions || user?.permissions?.length === 0)) ||
        user?.roles?.some((r) =>
            ["super_admin", "root_admin", "admin", "company"].includes(
                typeof r === "string" ? r : r?.name,
            ),
        );

    return menus
        .map((menu) => {
            if (menu.title === "Break" && !breakEnabled) {
                return null;
            }

            if (
                !projectEnabled &&
                ["Project", "Inventory", "Tools"].includes(menu.title)
            ) {
                return null;
            }

            const allowedChildren = (menu.child || []).filter((child) => {
                if (
                    !breakEnabled &&
                    [
                        "view-break-reason",
                        "view-break-list",
                        "view-break-reports",
                    ].includes(child.permission)
                ) {
                    return false;
                }

                if (
                    !projectEnabled &&
                    [
                        "view-tool-category",
                        "view-tool-unit",
                        "view-tool",
                        "view-tool-distribution",
                        "view-tool-damage",
                        "view-purchase",
                        "view-warehouse",
                        "view-stock-transfer",
                        "view-inventory",
                        "view-inventory-reports",
                        "view-purchase-reports",
                        "view-purchase-summary-reports",
                        "view-tool-distribution-reports",
                        "view-assigned-employee-reports",
                        "view-damage-reports",
                        "view-damage-summary-reports",
                    ].includes(child.permission)
                ) {
                    return false;
                }


                if (isCompanyOrSuperUser) {
                    return true;
                }

                if (!child.permission) {
                    return true;
                }

                if (userPerms.includes(child.permission)) {
                    return true;
                }

                if (
                    (child.permission === "view-salary-payment-reports" ||
                        child.permission === "view-salary-reports") &&
                    (userPerms.includes("view-salary-reports") ||
                        userPerms.includes("view-salary-payment-reports") ||
                        userPerms.includes("view-salary"))
                ) {
                    return true;
                }

                return false;
            });

            if (allowedChildren.length > 0) {
                return { ...menu, child: allowedChildren };
            }

            return null;
        })
        .filter(Boolean);
};
