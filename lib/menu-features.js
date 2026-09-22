export const isBreakFeatureEnabled = (featureSettings) =>
    featureSettings?.data?.features?.attendance?.break === true;

export const isProjectFeatureEnabled = (featureSettings) =>
    featureSettings?.data?.features?.project?.project !== false;

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
                    ].includes(
                        child.permission,
                    )
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

                return user?.permissions?.some(
                    (permission) => permission.name === child.permission,
                );
            });

            if (allowedChildren.length > 0) {
                return { ...menu, child: allowedChildren };
            }

            return null;
        })
        .filter(Boolean);
};
