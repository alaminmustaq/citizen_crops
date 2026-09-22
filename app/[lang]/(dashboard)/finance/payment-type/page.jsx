"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import fields from "./config/fields";
import { useRecPaymentType } from "@/domains/rec-payment-type/hook/useRecPaymentType";

const RecPaymentTypePage = () => {
    const { actions, recPaymentTypeState } = useRecPaymentType();

    return (
        <PageLayout>
            <BasicTableLayout
                addPermission={"create-payment-type"}
                addButtonLabel="Add Type"
                columns={columns(actions)}
                state={recPaymentTypeState}
            />

            <BasicModel
                title={
                    recPaymentTypeState?.form?.watch("id")
                        ? "Edit Type"
                        : "Create Type"
                }
                submitLabel={
                    recPaymentTypeState?.form?.watch("id") ? "Update" : "Create"
                }
                cancelLabel="Cancel"
                size="2xl"
                form={recPaymentTypeState.form}
                fields={fields}
                actions={actions} // pass the full actions object
            />
        </PageLayout>
    );
};

export default RecPaymentTypePage;
