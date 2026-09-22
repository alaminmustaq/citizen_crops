"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import { DynamicForm } from "@/components/form/dynamic-form";
import ReportActions from "@/components/report/ReportActions";
import CollapsibleToggleButton from "@/components/ui/CollapsibleToggleButton";
import useAttendance from "@/domains/attendance/hooks/useAttendance";
import columns from "./config/columns";
import filterFields from "./config/filterFields";
import { useState } from "react";

const BreakListPage = () => {
    const { actions, breakListState } = useAttendance();
    const [filtersOpen, setFiltersOpen] = useState(false);

    const updateFilters = () => {
        const values = breakListState.form.getValues();
        const url = new URL(window.location.href);

        ["date_from", "date_to"].forEach((key) => {
            if (values[key]) {
                url.searchParams.set(key, values[key]);
            } else {
                url.searchParams.delete(key);
            }
        });

        url.searchParams.set("page", "1");
        window.history.pushState({}, "", url.toString());
        breakListState.refetch();
    };

    const resetFilters = () => {
        breakListState.form.reset({
            ...breakListState.form.getValues(),
            date_from: "",
            date_to: "",
        });

        const url = new URL(window.location.href);
        url.searchParams.delete("date_from");
        url.searchParams.delete("date_to");
        url.searchParams.set("page", "1");
        window.history.pushState({}, "", url.toString());
        breakListState.refetch();
    };

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
                        form={breakListState.form}
                        fields={filterFields()}
                        onSubmit={updateFilters}
                    />
                    <ReportActions
                        form={breakListState.form}
                        onAction={updateFilters}
                        onReset={resetFilters}
                        showPdf={false}
                        showExcel={false}
                        showPrint={false}
                    />
                </div>
            )}

            <BasicTableLayout
                columns={columns(actions)}
                state={breakListState}
            />
        </PageLayout>
    );
};

export default BreakListPage;
