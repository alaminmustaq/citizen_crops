import { useEffect, useState, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
    handleServerValidationErrors,
    formReset,
    normalizeSelectValues,
    debounce,
    getFilterParams,
    prepareFilterPayload,
} from "@/utility/helpers";
import {
    useSalaryCreateMutation,
    useSalaryFetchQuery,
    useLazySalarySearchQuery,
    useSalaryFilterMutation,
    useSalaryPayMutation,
    useSalaryBulkPayMutation,
    useBankFetchActiveQuery,
    useSalaryPreviewMutation,
} from "../services/salaryApi";
import {
    branchSearchTemplate, 
} from "@/utility/templateHelper";
import { useMemo } from "react";
import useAuth from "@/domains/auth/hooks/useAuth";

export const useSalary = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState(getFilterParams());
    const [salaryFilter] = useSalaryFilterMutation();
    const [salaryCreate] = useSalaryCreateMutation();
    const [salaryPreview] = useSalaryPreviewMutation();
    const [salaryPay, { isLoading: isPaying }] = useSalaryPayMutation();
    const [salaryBulkPay, { isLoading: isBulkPaying }] = useSalaryBulkPayMutation();
    const [triggerSalarySearch] = useLazySalarySearchQuery();
    const { data: bankData } = useBankFetchActiveQuery();
    const { data: salary, refetch, isFetching } = useSalaryFetchQuery(filters);
    const { user } = useAuth(); 

    const [payModalOpen, setPayModalOpen] = useState(false);
    const [selectedSalaryForPay, setSelectedSalaryForPay] = useState(null);

    const [bulkPayModalOpen, setBulkPayModalOpen] = useState(false);
    const [selectedSalariesForBulkPay, setSelectedSalariesForBulkPay] = useState([]);
    const resetTableSelectionRef = useRef(null);

    // Approved Salary Preview State
    const [approvedPreviewRecords, setApprovedPreviewRecords] = useState([]);
    const [approvedPreviewPagination, setApprovedPreviewPagination] = useState({
        total: 0,
        current_page: 1,
        last_page: 1,
        per_page: 10,
    });
    const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

    const payForm = useForm({
        defaultValues: {
            amount: "",
            payment_date: new Date().toISOString().slice(0, 10),
            payment_method: "cash",
            company_bank_branch_id: "",
            reference_number: "",
            notes: "",
        }
    });

    const bulkPayForm = useForm({
        defaultValues: {
            payment_date: new Date().toISOString().slice(0, 10),
            payment_method: "cash",
            company_bank_branch_id: "",
            reference_number: "",
            notes: "",
        }
    });

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true, 
    });

    const openModel = useWatch({ control: form.control, name: "openModel" });

    // Update salary_month and payment_frequency when modal opens
    useEffect(() => {
        if (openModel) {
            form.setValue("salary_month", new Date().toISOString().slice(0, 7));
            if (!form.getValues("payment_frequency")) {
                form.setValue("payment_frequency", "monthly");
            }
        } else {
            setApprovedPreviewRecords([]);
        }
    }, [openModel]);

    const defaultValue={
        branch_id: branchSearchTemplate(user?.employee?.branch ? [user?.employee?.branch] : [])?.at(0) ?? null,
        salary_month: new Date().toISOString().slice(0, 7), // YYYY-MM
        payment_frequency: "monthly",
    }
    
    // Process bank branches for payment selection
    const activeBankBranches = useMemo(() => {
        const banksList = bankData?.data?.banks || bankData?.banks || (Array.isArray(bankData?.data) ? bankData.data : []) || (Array.isArray(bankData) ? bankData : []);
        const branches = [];
        if (Array.isArray(banksList)) {
            banksList.forEach((b) => {
                if (b.branches && Array.isArray(b.branches)) {
                    b.branches.forEach((br) => {
                        branches.push({
                            id: br.id,
                            label: `${b.bank_name} - ${br.branch_name} (${br.account_no || "No Acc"})`,
                            bank_name: b.bank_name,
                            branch_name: br.branch_name,
                            account_no: br.account_no,
                        });
                    });
                }
            });
        }
        return branches;
    }, [bankData]);

    const salaryState = { 
        data: salary?.data?.items || [], 
        form:{
            ...form,
            defaultValue: defaultValue,
        },
        refetch,
        pagination: salary?.data?.pagination || {},
        isFetching,
        payModalOpen,
        selectedSalaryForPay,
        payForm,
        bulkPayModalOpen,
        selectedSalariesForBulkPay,
        bulkPayForm,
        activeBankBranches,
        isPaying,
        isBulkPaying,
        approvedPreviewRecords,
        approvedPreviewPagination,
        isGeneratingPreview,
        user,
    }; 

    const actions = {
        onCreate: async (data) => {
            try {
                let { openModel, payroll_week, ...other } = data;
                let preparedData = normalizeSelectValues(other, [ 
                    "branch_id",
                    "department_id",
                    "project_id",
                    "job_position_id",
                ]);
                const response = await salaryCreate(preparedData).unwrap();

                if (response) {
                    toast.success(response?.message || "Salary generated successfully");
                    
                    if (response?.warnings && Array.isArray(response.warnings)) {
                        response.warnings.forEach((warn) => {
                            toast(warn, { icon: "⚠️", duration: 6000 });
                        });
                    }

                    refetch();
                    formReset(form);
                    form.setValue(
                        "salary_month",
                        new Date().toISOString().slice(0, 7)
                    );
                    form.setValue("payment_frequency", "monthly");
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },

        onFilter: async (data) => {
            try {
                const values = form.getValues();
                const rawPayload = prepareFilterPayload(values, searchParams);

                const payload = {};
                Object.entries(rawPayload).forEach(([k, v]) => {
                    if (v !== "" && v !== null && v !== undefined) {
                        if (k === "branch_id" && v === "all-branch") return;
                        payload[k] = v;
                    }
                });

                if (payload.payroll_week && typeof payload.payroll_week === "string" && payload.payroll_week.includes("|")) {
                    const [from, to] = payload.payroll_week.split("|");
                    payload.from_date = from;
                    payload.to_date = to;
                    delete payload.payroll_week;
                }

                setFilters(payload);

                const params = new URLSearchParams({ page: "1" });
                Object.entries(payload).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        value.forEach((v) => params.append(`${key}[]`, v));
                    } else {
                        params.set(key, String(value));
                    }
                });

                router.push(`${pathname}?${params.toString()}`);
                refetch();
            } catch (error) {
                toast.error("Failed to filter salaries");
            }
        },

        onSearch: debounce(async (inputValue, callback) => {
            form.setValue("search", inputValue);
            callback([]);
        }, 500),

        onGenerateSalary: async () => {
            setApprovedPreviewRecords([]);
            setApprovedPreviewPagination({ total: 0, current_page: 1, last_page: 1, per_page: 10 });
            form.reset({ openModel: true, payment_frequency: "monthly", salary_month: new Date().toISOString().slice(0, 7) }) 
        },
        onApproveSalary: async () => {
            setApprovedPreviewRecords([]);
            setApprovedPreviewPagination({ total: 0, current_page: 1, last_page: 1, per_page: 10 });
            form.reset({ openModel: true, model_for: "approved_salary", payment_frequency: "monthly", salary_month: new Date().toISOString().slice(0, 7) }) 
        },

        onGenerateApprovedPreview: async (formData, searchOptions = {}) => {
            try {
                setIsGeneratingPreview(true);
                const modelFor = formData?.model_for;
                const isApprovalMode = modelFor === "approved_salary";
                const scopeType = formData?.scope_type || "company";
                const freqVal = formData?.payment_frequency || "monthly";
                const branchVal = formData?.branch_id?.value ?? formData?.branch_id;
                const deptVal = formData?.department_id?.value ?? formData?.department_id;
                const projVal = formData?.project_id?.value ?? formData?.project_id;
                const monthVal = formData?.salary_month;

                const page = searchOptions.page || 1;
                const perPage = searchOptions.per_page || 10;
                const searchTerm = searchOptions.search || "";

                if (isApprovalMode) {
                    const queryParams = {
                        admin_status: "pending",
                        payment_frequency: freqVal,
                        page: page,
                        per_page: perPage,
                    };

                    if (monthVal) {
                        queryParams.salary_month = monthVal;
                    }

                    if (searchTerm) {
                        queryParams.search = searchTerm;
                    }

                    if (branchVal && branchVal !== "all-branch") {
                        queryParams.branch_id = branchVal;
                    }

                    if (scopeType === "company" && deptVal) {
                        queryParams.department_id = deptVal;
                    }

                    if (scopeType === "project" && projVal) {
                        queryParams.project_id = projVal;
                    }

                    const res = await triggerSalarySearch(queryParams, true).unwrap();

                    const items = res?.data?.items || res?.items || [];
                    const pag = res?.data?.pagination || res?.pagination || {
                        total: items.length,
                        current_page: page,
                        last_page: Math.ceil(items.length / perPage) || 1,
                        per_page: perPage,
                    };

                    setApprovedPreviewRecords(items);
                    setApprovedPreviewPagination(pag);

                    if (items.length === 0 && page === 1 && !searchTerm) {
                        toast("No pending salary records found matching the selected criteria.", { icon: "ℹ️" });
                    } else if (page === 1 && !searchTerm) {
                        toast.success(`Loaded ${pag.total || items.length} pending record(s) from server.`);
                    }
                } else {
                    const previewPayload = {
                        scope_type: scopeType,
                        payment_frequency: freqVal,
                        salary_month: monthVal,
                        branch_id: branchVal,
                        department_id: deptVal,
                        project_id: projVal,
                        search: searchTerm,
                        page: page,
                        per_page: perPage,
                    };
                    if (formData?.payroll_week && typeof formData.payroll_week === "string" && formData.payroll_week.includes("|")) {
                        const [from, to] = formData.payroll_week.split("|");
                        previewPayload.from_date = from;
                        previewPayload.to_date = to;
                    }

                    const res = await salaryPreview(previewPayload).unwrap();

                    const items = res?.data?.items || res?.items || [];
                    const pag = res?.data?.pagination || res?.pagination || {
                        total: items.length,
                        current_page: page,
                        last_page: Math.ceil(items.length / perPage) || 1,
                        per_page: perPage,
                    };

                    setApprovedPreviewRecords(items);
                    setApprovedPreviewPagination(pag);

                    if (items.length === 0 && page === 1 && !searchTerm) {
                        toast("No employee records found for generation matching criteria.", { icon: "ℹ️" });
                    } else if (page === 1 && !searchTerm) {
                        toast.success(`Loaded ${pag.total || items.length} employee record(s) for generation.`);
                    }
                }
            } catch (error) {
                toast.error("Failed to fetch records preview from server");
            } finally {
                setIsGeneratingPreview(false);
            }
        },

        onOpenPayModal: (salaryRecord) => {
            setSelectedSalaryForPay(salaryRecord);
            const net = Number(salaryRecord?.net_payable ?? 0);
            const paid = Number(salaryRecord?.paid_amount ?? 0);
            const due = salaryRecord?.due_amount != null ? Number(salaryRecord.due_amount) : Math.max(0, net - paid);

            payForm.reset({
                amount: due > 0 ? due : "",
                payment_date: new Date().toISOString().slice(0, 10),
                payment_method: "cash",
                company_bank_branch_id: "",
                reference_number: "",
                notes: "",
            });
            setPayModalOpen(true);
        },

        onClosePayModal: () => {
            setPayModalOpen(false);
            setSelectedSalaryForPay(null);
            payForm.reset();
        },

        onPaySubmit: async (data) => {
            if (!selectedSalaryForPay) return;
            try {
                const payload = {
                    salaryId: selectedSalaryForPay.id,
                    amount: parseFloat(data.amount),
                    payment_date: data.payment_date,
                    payment_method: data.payment_method,
                    company_bank_branch_id: (data.payment_method === "bank_transfer" || data.payment_method === "cheque") && data.company_bank_branch_id ? data.company_bank_branch_id : null,
                    reference_number: data.reference_number || null,
                    notes: data.notes || null,
                };

                const res = await salaryPay(payload).unwrap();
                toast.success(res?.message || "Salary payment recorded successfully!");
                refetch();
                setPayModalOpen(false);
                setSelectedSalaryForPay(null);
                payForm.reset();
            } catch (err) {
                toast.error(err?.data?.message || err?.message || "Failed to record payment");
            }
        },

        onOpenBulkPayModal: (selectedRows = [], resetSelection = null) => {
            if (resetSelection) {
                resetTableSelectionRef.current = resetSelection;
            }
            const payableSalaries = (selectedRows || []).filter((s) => {
                const isAdminApproved = s?.admin_status === "approved";
                const net = Number(s?.net_payable ?? 0);
                const paid = Number(s?.paid_amount ?? 0);
                const due = s?.due_amount != null ? Number(s.due_amount) : Math.max(0, net - paid);
                return isAdminApproved && due > 0;
            });

            if (payableSalaries.length === 0) {
                toast.error("Please select at least one approved salary record with a due amount.");
                return;
            }

            setSelectedSalariesForBulkPay(payableSalaries);
            bulkPayForm.reset({
                payment_date: new Date().toISOString().slice(0, 10),
                payment_method: "cash",
                company_bank_branch_id: "",
                reference_number: "",
                notes: "",
            });
            setBulkPayModalOpen(true);
        },

        onCloseBulkPayModal: () => {
            setBulkPayModalOpen(false);
            setSelectedSalariesForBulkPay([]);
            bulkPayForm.reset();
        },

        onBulkPaySubmit: async (data) => {
            if (!selectedSalariesForBulkPay || selectedSalariesForBulkPay.length === 0) return;
            try {
                const payload = {
                    salary_ids: selectedSalariesForBulkPay.map((s) => s.id),
                    payment_date: data.payment_date,
                    payment_method: data.payment_method,
                    company_bank_branch_id: (data.payment_method === "bank_transfer" || data.payment_method === "cheque") && data.company_bank_branch_id ? data.company_bank_branch_id : null,
                    reference_number: data.reference_number || null,
                    notes: data.notes || null,
                };

                const res = await salaryBulkPay(payload).unwrap();
                toast.success(res?.message || "Bulk salary payments recorded successfully!");
                if (typeof resetTableSelectionRef.current === "function") {
                    resetTableSelectionRef.current();
                    resetTableSelectionRef.current = null;
                }
                refetch();
                setBulkPayModalOpen(false);
                setSelectedSalariesForBulkPay([]);
                bulkPayForm.reset();
            } catch (err) {
                toast.error(err?.data?.message || err?.message || "Failed to record bulk payments");
            }
        },
        onReset: async () => {
            form.reset({
                branch_id: null,
                department_id: null,
                project_id: null,
                job_position_id: null,
                payment_frequency: "",
                salary_month: new Date().toISOString().slice(0, 7),
                payroll_week: null,
                from_date: null,
                to_date: null,
                admin_status: "",
                payment_status: "",
            });
            setFilters({});
            router.push(pathname);
            refetch();
        },
    };

    return { actions, salaryState };
};
