import { 
    useFetchActivityQuery,
} from "@/domains/activity/services/activityApi"; 
import { useForm, useFieldArray } from "react-hook-form"; 

export const useActivity = () => { 

    const {
        data: recordsResponse,
        refetch,
        isFetching,
    } = useFetchActivityQuery(); 
    

    const form = useForm({
        mode: "onBlur",
        reValidateMode: "onSubmit",
        shouldFocusError: true,
        defaultValues: {
            id: "",
            financial_type: "income",
            project_id: "",
            transaction_type: "regular",
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

    const activityState = {
        data: recordsResponse?.data?.activity_logs || [],
        form: { ...form, fields },
        refetch,
        pagination: recordsResponse?.data?.pagination || {},
        isFetching,
    };

    const actions = { 
    };

    return { actions, activityState };
};
