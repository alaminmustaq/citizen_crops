"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import fields from "./config/fields";
import { useUnit } from "@/domains/inventory/tool/unit/hook/useUnit";

const UnitPage = () => {
    const { actions, unitState } = useUnit();

    return (
        <PageLayout>
            <BasicTableLayout
                addPermission={"create-tool-unit"}
                addButtonLabel="Add Unit"
                columns={columns(actions)}
                state={unitState}
            />

            <BasicModel
                title={
                    unitState?.form?.watch("id") ? "Edit Unit" : "Create Unit"
                }
                submitLabel={unitState?.form?.watch("id") ? "Update" : "Create"}
                cancelLabel="Cancel"
                size="2xl"
                form={unitState.form}
                fields={fields}
                actions={actions} // <-- pass full actions like BranchPage
            />
        </PageLayout>
    );
};

export default UnitPage;
