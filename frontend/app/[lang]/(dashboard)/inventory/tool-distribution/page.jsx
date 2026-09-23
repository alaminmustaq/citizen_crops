"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import fields from "./config/fields";
import { useToolDistribution } from "@/domains/inventory/tool-distribution/hook/useToolDistribution";
import ReturnFields from "./config/ReturnFields";

const ToolDistributionPage = () => {
  const { actions, toolDistributionState } = useToolDistribution();


  return (
      <PageLayout>
          <BasicTableLayout
              addPermission={"create-tool-distribution"}
              addButtonLabel="Add Tool Distribution"
              columns={columns(actions)}
              state={toolDistributionState}
          />

          <BasicModel
              title={
                  toolDistributionState?.form?.watch("id")
                      ? toolDistributionState?.form?.watch("type") == "return"
                          ? "Update Return"
                          : "Edit Tool Distribution"
                      : "Create Tool Distribution"
              }
              submitLabel={
                  toolDistributionState?.form?.watch("id") ?    toolDistributionState?.form?.watch("type") == "return"
                      ? "Update Return" :  "Update" : "Create"
              }
              cancelLabel="Cancel"
              size="5xl"
              form={toolDistributionState.form}
              fields={
                  toolDistributionState?.form?.watch("type") == "return"
                      ? ReturnFields
                      : fields(toolDistributionState.form)
              }
              actions={actions}
          />
      </PageLayout>
  );
};

export default ToolDistributionPage;