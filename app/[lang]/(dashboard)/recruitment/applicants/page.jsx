"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "./config/columns";
import filterFields from "./config/filterFields";
import { DynamicForm } from "@/components/form/dynamic-form";
import ReportActions from "@/components/report/ReportActions";
import { useState } from "react";
import CollapsibleToggleButton from "@/components/ui/CollapsibleToggleButton";
import { useApplicants } from "@/domains/recruitment/applicants/hook/useApplicants";

const ApplicantsPage = () => {
    const { actions, applicantState } = useApplicants();
    const [filtersOpen, setFiltersOpen] = useState(false);

    return (
        <PageLayout>
            <div className="mb-4 flex justify-between items-center">
                <CollapsibleToggleButton
                    isOpen={filtersOpen}
                    onToggle={() => setFiltersOpen((prev) => !prev)}
                />
            </div>

            {filtersOpen && (
                <div className="bg-white p-6 rounded-md shadow mb-6 transition-all duration-300">
                    <DynamicForm
                        form={applicantState.form}
                        fields={filterFields(applicantState.jobs)}
                        onSubmit={actions.onFilter}
                    />
                    <ReportActions
                        form={applicantState.form}
                        onAction={actions.onFilter}
                        onReset={actions.onReset}
                        showPdf={false}
                        showExcel={false}
                    />
                </div>
            )}

            <BasicTableLayout
                addPermission={"none"} // Not used for listing
                columns={columns(actions)}
                state={applicantState}
            />
        </PageLayout>
    );
};

export default ApplicantsPage;
