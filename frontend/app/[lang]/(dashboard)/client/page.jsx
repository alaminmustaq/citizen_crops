"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import clientColumns from "./config/columns"; // your simplified client columns
import clientFields from "./config/fields";   // simplified client fields
import BasicModel from "@/components/model/basic-model";
import { useClient } from "@/domains/client/hook/useClient";

const ClientPage = () => {
  const { actions, clientState } = useClient(); // Custom hook for client actions

  return (
    <PageLayout>
      <BasicTableLayout
       addPermission={"create-client"}
        addButtonLabel="Add Client"
        columns={clientColumns(actions)}
        state={clientState}
      />
      <BasicModel
        title={clientState.form.watch("id") ? "Edit Client" : "Create Client"}
        submitLabel={clientState.form.watch("id") ? "Update" : "Create"}
        cancelLabel="Cancel"
        size="2xl"
        form={clientState.form}
        fields={clientFields}
        actions={actions}
      />
    </PageLayout>
  );
};

export default ClientPage;
