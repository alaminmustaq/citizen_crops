"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import fields from "./config/fields";
import { useBank } from "@/domains/bank/hook/useBank";

const BankPage = () => {
  const { actions, bankState } = useBank();

  return (
    <PageLayout>
      {/* ===== Table Section ===== */}
      <BasicTableLayout
        addPermission={"create-bank"}
        addButtonLabel="Add Bank"
        columns={columns(actions)}
        state={bankState}
      />

      {/* ===== Modal Form Section ===== */}
      <BasicModel
        title={
          bankState?.form?.watch("id") ? "Edit Bank" : "Create Bank"
        }
        submitLabel={
          bankState?.form?.watch("id") ? "Update" : "Create"
        }
        cancelLabel="Cancel"
        size="5xl" // large form for branches
        form={bankState.form}
        fields={fields}
        actions={actions}
      />
    </PageLayout>
  );
};

export default BankPage;
