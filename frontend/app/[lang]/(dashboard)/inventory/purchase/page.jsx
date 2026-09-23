"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns"; // purchase table columns
import fields from "./config/fields"; // purchase form fields
import { usePurchase } from "@/domains/inventory/purchase/hook/usePurchase";

const PurchasePage = () => {
  const { actions, purchaseState } = usePurchase();

  return (
    <PageLayout>
      {/* Table */}
      <BasicTableLayout
        addPermission={"create-purchase"}
        addButtonLabel="Add Purchase"
        columns={columns(actions)}
        state={purchaseState}
      />

      {/* Modal Form */}
      <BasicModel
        title={purchaseState?.form?.watch("id") ? "Edit Purchase" : "Create Purchase"}
        submitLabel={purchaseState?.form?.watch("id") ? "Update" : "Create"}
        cancelLabel="Cancel"
        size="5xl" // wider modal for purchase details
        form={purchaseState.form}
        fields={fields}
        actions={actions}
      />
    </PageLayout>
  );
};

export default PurchasePage;
