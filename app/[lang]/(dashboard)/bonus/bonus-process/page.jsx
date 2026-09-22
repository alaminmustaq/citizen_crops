"use client";

import { useEffect } from "react";
import PageLayout from "@/components/page-layout";
import BasicDataTable from "@/components/table/basic-table";
import columns from "./config/columns";
import resultColumns from "./config/resultColumns";
import fields from "./config/fields";
import { DynamicForm } from "@/components/form/dynamic-form";
import { useBonusProcess } from "@/domains/bonus/bonus-process/hook/useBonusProcess";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, RefreshCw } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

const BonusProcessPage = () => {
    const { actions, bonusProcessState } = useBonusProcess();
    const { form, data, pagination, isFetching, summary, runResults, runSummary, processRun, isRunning, isFetchingResults, refetchResults, refetch } = bonusProcessState;

    const tableState = {
        data,
        pagination,
        form: bonusProcessState.form,
        refetch: bonusProcessState.refetch,
        isFetching,
    };

    const showResultsSection = runSummary != null || processRun != null || (Array.isArray(runResults) && runResults.length > 0) || isFetchingResults;
    const showSetupsTable = !showResultsSection;

    useEffect(() => {
        if (showSetupsTable) refetch();
    }, [showSetupsTable, refetch]);

    return (
        <PageLayout>
            <div className="bg-white p-6 rounded-md shadow mb-6">
                <h2 className="text-lg font-semibold mb-4">Process Bonus (Bonus name wise & Date wise)</h2>
                <DynamicForm
                    form={form}
                    fields={fields(form)}
                    onSubmit={() => {}}
                    gridCols="grid-cols-12"
                />
                <div className="flex gap-3 mt-4">
                    <Button
                        type="button"
                        onClick={actions.onProcess}
                        disabled={isRunning}
                    >
                        <Play className="w-4 h-4 mr-2" />
                        Process
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={actions.onReset}
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={refetchResults}
                        disabled={isFetchingResults}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isFetchingResults ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {(runSummary != null || processRun) && (
                <div className="bg-white p-4 rounded-md shadow mb-4">
                    <p className="text-sm text-muted-foreground">
                        {runSummary != null && (
                            <>
                                <strong>{runSummary.total_employees ?? 0}</strong> employee(s) eligible · Total bonus amount:{" "}
                                <strong>{Number(runSummary.total_bonus_amount ?? 0).toLocaleString()}</strong>
                                {processRun?.created_at && " · "}
                            </>
                        )}
                        {processRun?.created_at && (
                            <>
                                Last process:{" "}
                                <strong>{formatDateTime(processRun.created_at)}</strong>
                            </>
                        )}
                    </p>
                </div>
            )}

            {showResultsSection && (
                <div className="bg-white rounded-md shadow">
                    <h3 className="text-base font-semibold p-4 pb-0">Process results (by employee)</h3>
                    <BasicDataTable
                        columns={resultColumns(actions)}
                        form={bonusProcessState.form}
                        data={Array.isArray(runResults) ? runResults : []}
                        pagination={false}
                        refetch={refetchResults}
                        loading={isFetchingResults}
                        addButtonLabel=""
                        addPermission="bonus-process-add"
                        search={false}
                        filter={false}
                    />
                </div>
            )}

            {showSetupsTable && summary?.total_count != null && (
                <p className="text-sm text-muted-foreground mb-2">
                    Found <strong>{summary.total_count}</strong> bonus setup(s)
                </p>
            )}

            {showSetupsTable && (
                <BasicDataTable
                    columns={columns()}
                    form={tableState.form}
                    data={tableState.data}
                    pagination={pagination?.total ? pagination : false}
                    refetch={tableState.refetch}
                    loading={tableState.isFetching}
                    addButtonLabel=""
                    addPermission="bonus-process-add"
                    search={false}
                />
            )}
        </PageLayout>
    );
};

export default BonusProcessPage;
