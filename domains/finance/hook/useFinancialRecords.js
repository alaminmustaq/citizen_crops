import {
    useCreateFinancialRecordMutation,
    useUpdateFinancialRecordMutation,
    useDeleteFinancialRecordMutation,
    useFetchFinancialRecordsQuery,
} from "@/domains/finance/services/financialRecordsApi";
import {
    handleServerValidationErrors,
    formReset,
    normalizeSelectValues,
     prepareFilterPayload,
} from "@/utility/helpers";
import {
    bankTemplate,
    employTemplate,
    projectTemplate,
    receivePaymentTemplate,
    branchSearchTemplate
} from "@/utility/templateHelper";
import { useForm, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import useAuth from "@/domains/auth/hooks/useAuth";
import { useState } from "react";
import {
    useRouter,
    usePathname,
    useParams,
    useSearchParams,
} from "next/navigation";

export const useFinancialRecords = () => {
      const router = useRouter();
     const { user } = useAuth();
    const [createFinancialRecord] = useCreateFinancialRecordMutation();
    const [updateFinancialRecord] = useUpdateFinancialRecordMutation();
    const [deleteFinancialRecord] = useDeleteFinancialRecordMutation();

    // For Filters
        const [filters, setFilters] = useState({});
        const pathname = usePathname();
        const searchParams = useSearchParams();
        const pageFromUrl = searchParams.get("page") || "1";
        const queryParams = {
            ...filters,
            ...(pageFromUrl ? { page: pageFromUrl } : {}),
        };

    const {
        data: recordsResponse,
        refetch,
        isFetching,
    } = useFetchFinancialRecordsQuery({ params: queryParams });

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
        defaultValues: {
            id: "",
            // financial_type: "income",
            project_id: "",
            // transaction_type: "regular",
            transaction_date: "",
            expected_rec_pay_date: "",
            receive_payment_date: "",
            bank_id: "",
            bank_branch_id: "",
            bank_transaction_number: "",
            transaction_status: "pending",
            reference_remarks: "",
            total_amount: "",
            transaction_details: [
                {
                    employee_id: null,
                    rec_payment_type_id: null,
                    amount: 0,
                    description: "",
                },
            ],
            openModel: false,
        },
    });

     const defaultValue = {
        transaction_type: "regular",
          branch_id: branchSearchTemplate(
                                user?.employee?.branch ? [user?.employee?.branch] : []
                            )?.at(0) ?? null,
            
    };


    const fields = useFieldArray({
        control: form.control,
        name: "transaction_details",
    });

    // Ensure at least one transaction detail exists
    if (fields.fields.length === 0) {
        fields.append({
            employee_id: null,
            rec_payment_type_id: null,
            amount: 0,
            description: "",
        });
    }

    const financialState = {
        data: recordsResponse?.data?.financial_records || [],
        form: { ...form, fields, defaultValue: defaultValue, },
        refetch,
        pagination: recordsResponse?.data?.pagination || {},
        isFetching,
    };

    const actions = {
          //  FILTER
                onFilter: async () => {
                    const values = form.getValues();
                    const payload = prepareFilterPayload(values, searchParams);
        
                    setFilters(payload);
        
                    const params = new URLSearchParams({ page: "1" });
        
                    Object.entries(payload).forEach(([key, value]) => {
                        if (Array.isArray(value)) {
                            value.forEach((v) => params.append(`${key}[]`, v));
                        } else {
                            params.set(key, value);
                        }
                    });
        
                    router.push(`${pathname}`);
                    refetch();
                },
        
                //  RESET
                onReset: async () => {
                    const resetValues = Object.fromEntries(
                        Object.entries(form.getValues()).map(([key, value]) => [
                            key,
                            Array.isArray(value) ? [] : "",
                        ]),
                    );
        
                    form.reset(resetValues);
                    setFilters({});
                    await form.trigger();
                    refetch();
                },
        onCreate: async (data) => {
            try {
                // normalize header fields (selects)
                const payloadHeader = normalizeSelectValues(data, [
                    "bank_id",
                    "bank_branch_id",
                    "project_id",
                    "branch_id",
                    "transaction_status", 
                ]);

                const detailList = (data.transaction_details || []).map(
                    (item) =>
                        normalizeSelectValues(item, [
                            "employee_id",
                            "rec_payment_type_id",
                        ])
                );

                let prepare = {
                    ...payloadHeader,
                    transaction_details: detailList,
                };

                const response = await createFinancialRecord(prepare).unwrap();

                if (response.success) {
                    toast.success("Financial record created");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },
        onEdit: (record, processStatus = false) => {
            // record is the selected financial record from table
            const detailList = (record.details || []).map((d) => ({
                id: d.id || "",
                employee_id:
                    employTemplate(d?.employee_id ? [d.employee_id] : [])?.at(
                        0
                    ) ?? null,
                rec_payment_type_id:
                    receivePaymentTemplate(
                        d?.rec_payment_type_id ? [d.rec_payment_type_id] : []
                    )?.at(0) ?? null,
                description: d.description || "",
                amount: d.amount || 0,
            }));

            form.reset({
                id: record.id || "",
                financial_type: record.financial_type || "income",
                project_id:
                    projectTemplate(
                        record?.project_id ? [record.project_id] : []
                    )?.at(0) ?? null,
                branch_id: record.branch
                    ? { label: record.branch.name, value: record.branch.id }
                    : record.branch_id
                    ? { label: "Unknown", value: record.branch_id }
                    : null,
                transaction_type: record.transaction_type || "regular",
                transaction_type_ref: record.transaction_type || "regular",
                transaction_date: record.transaction_date || "",
                expected_rec_pay_date: record.expected_rec_pay_date || "",
                receive_payment_date: record.receive_payment_date || "",
                bank_branch_id:
                    bankTemplate(record?.bank_id ? [record.bank_id] : [])?.at(
                        0
                    ) ?? null,
                bank_id: record?.bank_id?.id || "",
                bank_transaction_number: record.bank_transaction_number || "",
                transaction_status: record.transaction_status || "pending",
                reference_remarks: record.reference_remarks || "",
                total_amount: record.total_amount || "",
                transaction_details: detailList,
                openModel: true,
                processStatus: processStatus,
            });
        },
        onUpdate: async (data) => {
            try {
                const { id, transaction_details, ...header } = data;

                const normalizedHeader = normalizeSelectValues(header, [
                    "bank_id",
                    "bank_branch_id",
                    "project_id",
                    "branch_id",
                    "transaction_status", 
                ]);

                normalizedHeader.transaction_details = (
                    transaction_details || []
                ).map((d) =>
                    normalizeSelectValues(d, [
                        "employee_id",
                        "rec_payment_type_id",
                    ])
                );

                const response = await updateFinancialRecord({
                    id,
                    credentials: normalizedHeader,
                }).unwrap();

                if (response.success) {
                    toast.success("Financial record updated");
                    refetch();
                    formReset(form);
                    form.setValue("openModel", false);
                }
            } catch (apiErrors) {
                handleServerValidationErrors(apiErrors, form.setError);
            }
        },
        onDelete: async (id) => {
            try {
                if (!confirm("Are you sure you want to delete this record?"))
                    return;
                const response = await deleteFinancialRecord({ id }).unwrap();
                if (response.success) {
                    toast.success("Deleted");
                    refetch();
                }
            } catch (error) {
                toast.error("Failed to delete");
            }
        },

        onMarkAsPaid: async (data) => {
            actions.onEdit(data, "marked_as_paid");
        },
        payNow: async (data) => {
            actions.onEdit(data, "pay_now");
        },
    };

    return { actions, financialState };
};
