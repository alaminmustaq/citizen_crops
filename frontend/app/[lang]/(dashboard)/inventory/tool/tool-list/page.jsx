"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import fields from "./config/fields";
import { useTool } from "@/domains/inventory/tool/tool-list/hook/useTool";

const ToolPage = () => {
  const { actions, toolState } = useTool();

  return (
    <PageLayout>
      <BasicTableLayout
        addPermission={"create-tool"}
        addButtonLabel="Add Tool"
        columns={columns(actions)}
        state={toolState}
      />

      <BasicModel
        title={toolState?.form?.watch("id") ? "Edit Tool" : "Create Tool"}
        submitLabel={toolState?.form?.watch("id") ? "Update" : "Create"}
        cancelLabel="Cancel"
        size="2xl"
        form={toolState.form}
        fields={fields}
        actions={actions} // <-- pass full actions like BranchPage
      />
    </PageLayout>
  );
};

export default ToolPage;
