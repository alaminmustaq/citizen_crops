import { useForm } from "react-hook-form";
import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
    useLazyFetchBonusProcessQuery,
    useLazyFetchBonusProcessResultsQuery,
    useRunBonusProcessMutation,
    useDeleteBonusProcessResultMutation,
} from "../services/bonusProcessApi";
import toast from "react-hot-toast";

function lastDayOfMonth(year, month) {
    const d = new Date(year, month, 0);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

function normalizeResults(res) {
    return Array.isArray(res?.data?.data?.results) ? res.data.data.results
        : Array.isArray(res?.data?.results) ? res.data.results
        : Array.isArray(res?.results) ? res.results
        : [];
}
function normalizeSummary(res) {
    return res?.data?.data?.summary ?? res?.data?.summary ?? res?.summary ?? null;
}
function normalizeProcessRun(res) {
    return res?.data?.data?.process_run ?? res?.data?.process_run ?? res?.process_run ?? null;
}

export const useBonusProcess = () => {
    const searchParams = useSearchParams();
    const [trigger, { data, isFetching }] = useLazyFetchBonusProcessQuery();
    const [fetchResults, { data: resultsData, isFetching: isFetchingResults }] = useLazyFetchBonusProcessResultsQuery();
    const [runBonusProcess, { data: runData, isFetching: isRunning }] = useRunBonusProcessMutation();
    const [deleteBonusProcessResult] = useDeleteBonusProcessResultMutation();
    const [runResultsLocal, setRunResultsLocal] = useState([]);
    const [runSummaryLocal, setRunSummaryLocal] = useState(null);
    const [processRunLocal, setProcessRunLocal] = useState(null);

    const form = useForm({
        mode: "onBlur",
        defaultValues: {
            bonus_type_id: null,
            bonus_name: null,
            salary_type: null,
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            end_date: "",
        },
    });

    const refetch = useCallback(() => {
        const page = searchParams.get("page") || 1;
        const v = form.getValues();
        const params = {
            page,
            per_page: 15,
            bonus_type_id: v.bonus_type_id?.value ?? v.bonus_type_id ?? undefined,
            bonus_setup_id: v.bonus_name?.value ?? v.bonus_name ?? undefined,
            year: v.year ?? undefined,
            month: v.month ?? undefined,
            salary_type: v.salary_type ?? undefined,
        };
        return trigger(params);
    }, [trigger, form, searchParams]);

    const loadResults = useCallback(async (params = {}) => {
        try {
            const res = await fetchResults(params).unwrap();
            setRunResultsLocal(normalizeResults(res));
            setRunSummaryLocal(normalizeSummary(res));
            setProcessRunLocal(normalizeProcessRun(res));
        } catch {
            setRunResultsLocal([]);
            setRunSummaryLocal(null);
            setProcessRunLocal(null);
        }
    }, [fetchResults]);

    useEffect(() => {
        loadResults({ per_page: 500 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const runResults =
        Array.isArray(runResultsLocal) && runResultsLocal.length > 0 ? runResultsLocal
        : Array.isArray(runData?.data?.data?.results) ? runData.data.data.results
        : Array.isArray(runData?.data?.results) ? runData.data.results
        : Array.isArray(runData?.results) ? runData.results
        : normalizeResults(resultsData);
    const runSummary = runSummaryLocal ?? runData?.data?.data?.summary ?? runData?.data?.summary ?? runData?.summary ?? normalizeSummary(resultsData);
    const processRun = processRunLocal ?? runData?.data?.process_run ?? normalizeProcessRun(resultsData);

    const bonusProcessState = {
        data: data?.data?.bonus_setups || [],
        pagination: data?.data?.pagination || {},
        summary: data?.data?.summary || {},
        form: { ...form },
        isFetching,
        refetch,
        runResults,
        runSummary,
        processRun,
        isRunning,
        isFetchingResults,
        refetchResults: () => loadResults({ per_page: 500 }),
    };

    const actions = {
        onProcess: async () => {
            const valid = await form.trigger();
            if (!valid) {
                toast.error("Please fill all required fields");
                return;
            }
            const values = form.getValues();
            const year = values.year ? Number(values.year) : new Date().getFullYear();
            const month = values.month ? Number(values.month) : new Date().getMonth() + 1;
            const endDate = values.end_date
                ? values.end_date
                : lastDayOfMonth(year, month);

            const body = {
                year,
                month,
                end_date: endDate,
                bonus_type_id: values.bonus_type_id?.value ?? values.bonus_type_id,
                bonus_setup_id: values.bonus_name?.value ?? values.bonus_name,
                salary_type: values.salary_type ?? undefined,
            };

            try {
                const res = await runBonusProcess(body).unwrap();
                const results =
                    Array.isArray(res?.data?.data?.results) ? res.data.data.results
                    : Array.isArray(res?.data?.results) ? res.data.results
                    : Array.isArray(res?.results) ? res.results
                    : [];
                const summary = res?.data?.data?.summary ?? res?.data?.summary ?? res?.summary ?? null;
                const processRunPayload = res?.data?.data?.process_run ?? res?.data?.process_run ?? res?.process_run ?? null;
                setRunResultsLocal(results);
                setRunSummaryLocal(summary);
                if (processRunPayload) setProcessRunLocal(processRunPayload);
                toast.success("Bonus process completed successfully");
            } catch (err) {
                toast.error(err?.data?.message || "Failed to run bonus process");
            }
        },

        onDelete: async (id) => {
            try {
                if (!confirm("Are you sure you want to delete this bonus process record?")) return;
                const currentList = runResultsLocal.length > 0 ? runResultsLocal : (runData?.data?.results || []);
                const deletedRow = currentList.find((r) => r.id === id);
                await deleteBonusProcessResult(id).unwrap();
                const nextList = currentList.filter((r) => r.id !== id);
                setRunResultsLocal(nextList);
                setRunSummaryLocal((prev) =>
                    prev
                        ? {
                              total_employees: Math.max(0, (prev.total_employees ?? 0) - 1),
                              total_bonus_amount: Math.max(
                                  0,
                                  (prev.total_bonus_amount ?? 0) - (deletedRow?.bonus_amount ?? 0)
                              ),
                          }
                        : null
                );
                toast.success("Bonus process record deleted");
            } catch (err) {
                toast.error(err?.data?.message || "Failed to delete bonus process record");
            }
        },

        onReset: () => {
            form.reset({
                bonus_type_id: null,
                bonus_name: null,
                salary_type: null,
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                end_date: "",
            });
            setRunResultsLocal([]);
            setRunSummaryLocal(null);
            setProcessRunLocal(null);
        },

        onRefresh: () => loadResults({ per_page: 500 }),
    };

    return { actions, bonusProcessState };
};
