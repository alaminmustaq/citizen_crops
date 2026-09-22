"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import { DynamicForm } from "@/components/form/dynamic-form";
import filterFields from "./config/filterFields";
import columns from "./config/columns";
import ReportActions from "@/components/report/ReportActions";
import fields from "./config/fields";
import { useState } from "react"; 
import { useTool } from "@/domains/inventory/tool/tool-list/hook/useTool";
import CollapsibleToggleButton from "@/components/ui/CollapsibleToggleButton";

const ToolPage = () => {
  const { actions, toolState } = useTool();
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <PageLayout>
        {/* Filter Header */}
            <div className="mb-4 flex justify-between items-center"> 
                <CollapsibleToggleButton
                    isOpen={filtersOpen}
                    onToggle={() => setFiltersOpen(prev => !prev)}
                />
            </div>

            {/* Collapsible Filter Panel */}
            {filtersOpen && (
                <div className="bg-white p-6 rounded-md shadow mb-6 transition-all duration-300">
                    <DynamicForm
                        form={toolState.form}
                        fields={filterFields(toolState.form)}
                        onSubmit={() => actions.onFilter}
                    />
                    <ReportActions
                        form={toolState.form}
                        onAction={actions.onFilter}
                        onReset={actions.onReset}
                        showPdf={false}
                        showExcel={false}
                    />
                </div>
            )}
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
