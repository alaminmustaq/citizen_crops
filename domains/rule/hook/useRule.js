import { useForm } from "react-hook-form";
import { useEffect } from "react";
import {
    useFetchRulesQuery,
    useUpdateRulesMutation,
    useUpdatePunishmentRulesMutation,
} from "../services/ruleApi";
import toast from "react-hot-toast";

export const useRule = () => {
    const { data, isFetching } = useFetchRulesQuery();

    const [updateRules] = useUpdateRulesMutation();
    const [updatePunishmentRules] = useUpdatePunishmentRulesMutation();

    // 🔹 Separate forms
    const generalForm = useForm({ defaultValues: {} });
    const punishmentForm = useForm({ defaultValues: {} });

    // 🔹 Populate General Rules
    useEffect(() => {
        if (data?.data?.general && Object.keys(data.data.general).length > 0) {
            generalForm.reset(data.data.general);
        }
    }, [data]);

    // 🔹 Populate Punishment Rules
    useEffect(() => {
        if (data?.data?.punishment) {
            punishmentForm.reset(data.data.punishment);
        }
    }, [data]);

    const onUpdate = async (values) => {
        try {
            await updateRules(values).unwrap();
            toast.success("General rules updated");
        } catch {
            toast.error("Failed to update general rules");
        }
    };

    const onPunishmentUpdate = async (values) => {
        try {
            await updatePunishmentRules(values).unwrap();
            toast.success("Punishment rules updated");
        } catch {
            toast.error("Failed to update punishment rules");
        }
    };

    return {
        ruleState: { generalForm, punishmentForm, isFetching },
        actions: { onUpdate, onPunishmentUpdate },
    };
};
