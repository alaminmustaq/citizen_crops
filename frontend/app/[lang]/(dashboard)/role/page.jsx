"use client";
import React from "react";
import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import permissionColumns from "./config/permissionColumns";
import fields from "./config/fields";
import { useRole } from "@/domains/role-and-permission/role/hook/useRole";

const RolePage = () => {
    const { actions, rolesState } = useRole(); // Custom hook handles roles and permissions

    const form = rolesState.form;
    const isEdit = !!form?.watch("id");
    const isPermissionMode = !!form?.watch("openPermissionMode");
    // console.log(rolesState.permissions);

    return (
        <PageLayout>
            {/* Role Table */}
            <BasicTableLayout
                addPermission={"manage-settings"}
                addButtonLabel="Add Role"
                columns={columns(actions)}
                state={rolesState}
            />

            {/* Role Create/Edit Modal */}
            <BasicModel
                title={
                    isPermissionMode
                        ? "Permission Update"
                        : isEdit
                        ? "Role Edit"
                        : "Role Create"
                }
                submitLabel={isEdit || isPermissionMode ? "Update" : "Create"}
                cancelLabel="Cancel"
                size="2xl"
                form={rolesState.form}
                fields={isPermissionMode ? [] : fields}
                actions={actions}
            >
                <div className="text-right mb-2">
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-blue-600"
                            onChange={async (e) => {
                                const roleId = form.getValues("id"); // get current role id

                                if (e.target.checked) {
                                    // Call your hook action to check all permissions
                                    let dataGet =
                                        await actions.onCheckAllPermissions(
                                            roleId, true
                                        );


                                
                                    // Optionally, update the selectedPermission array in the form
                                    const allPermissionIds =
                                        dataGet.data.permissions.permissions.map((p) => p.id);
                                    form.setValue(
                                        "selectedPermission",
                                        allPermissionIds
                                    );
                                } else {
                                    // Optional: uncheck all permissions
                                     await actions.onCheckAllPermissions(
                                            roleId, false
                                        )
                                    form.setValue("selectedPermission", []);
                                }
                            }}
                        />
                        <span className="ml-2">Check all</span>
                    </label>
                </div>

                <BasicTableLayout
                    addButtonLabel={false}
                    columns={permissionColumns(actions, form)}
                    state={{
                        form: rolesState.form,
                        data: rolesState.permissions,
                        pagination: true,
                        isFetching: false,
                    }}
                    filter={false}
                />
            </BasicModel>
        </PageLayout>
    );
};

export default RolePage;
