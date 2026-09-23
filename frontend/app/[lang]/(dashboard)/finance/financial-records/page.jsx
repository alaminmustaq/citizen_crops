"use client";
import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "./config/columns";
import fields from "./config/fields";
import futurePaymentFields from "./config/futurePaymentField";
import BasicModel from "@/components/model/basic-model";
import { useFinancialRecords } from "@/domains/finance/hook/useFinancialRecords";

const FinancialRecordsPage = () => {
    const { actions, financialState } = useFinancialRecords();

    return (
        <PageLayout>
            <BasicTableLayout
                addPermission={"create-financial-records"}
                addButtonLabel="Add Financial Record"
                columns={columns(actions)}
                state={financialState}
                filterCustom={{
                    transaction_type: {
                        multiple: true,
                        values: [
                            { key: "regular", value: "Regular" },
                            { key: "future_payment", value: "Future Payment" },
                            { key: "repeat", value: "Repeat" },
                        ],
                    }
                }}
            />

            <BasicModel
                title={
                    financialState?.form?.watch("id")
                        ? "Edit Record"
                        : "Create Record"
                }
                submitLabel={
                    financialState?.form?.watch("id") ? "Update" : "Create"
                }
                cancelLabel="Cancel"
                size="5xl"
                form={financialState.form}
                fields={
                    financialState?.form?.watch("processStatus") ==
                    "marked_as_paid"
                        ? futurePaymentFields
                        : fields(financialState.form)
                }
                actions={actions}
            />
        </PageLayout>
    );
};

export default FinancialRecordsPage;
