"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import fields from "./config/fields";
import { useWarehouse } from "@/domains/inventory/warehouse/hook/useWarehouse";

const WarehousePage = () => {
    const { actions, warehouseState } = useWarehouse();

    return (
        <PageLayout>
            <BasicTableLayout
                addPermission={"create-warehouse"}
                addButtonLabel="Add Warehouse"
                columns={columns(actions)}
                state={warehouseState}
            />

            <BasicModel
                title={
                    warehouseState?.form?.watch("id")
                        ? "Edit Warehouse"
                        : "Create Warehouse"
                }
                submitLabel={
                    warehouseState?.form?.watch("id") ? "Update" : "Create"
                }
                cancelLabel="Cancel"
                size="2xl"
                form={warehouseState.form}
                fields={fields}
                actions={actions} // pass the full actions object
            />
        </PageLayout>
    );
};

export default WarehousePage;
