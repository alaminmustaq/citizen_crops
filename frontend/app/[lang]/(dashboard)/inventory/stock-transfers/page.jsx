"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import fields from "./config/fields";
import { useStockTransfer } from "@/domains/inventory/stock-transfer/hook/useStockTransfer";

const StockTransferPage = () => {
  const { actions, stockTransferState } = useStockTransfer();

  return (
    <PageLayout>
      {/* ===== Table Section ===== */}
      <BasicTableLayout
        addPermission={"create-stock-transfer"}
        addButtonLabel="Add Stock Transfer"
        columns={columns(actions)}
        state={stockTransferState}
      />

      {/* ===== Modal Form Section ===== */}
      <BasicModel
        title={
          stockTransferState?.form?.watch("id")
            ? "Edit Stock Transfer"
            : "Create Stock Transfer"
        }
        submitLabel={
          stockTransferState?.form?.watch("id") ? "Update" : "Create"
        }
        cancelLabel="Cancel"
        size="5xl" // for larger form with details
        form={stockTransferState.form}
        fields={fields}
        actions={actions}
      />
    </PageLayout>
  );
};

export default StockTransferPage;
