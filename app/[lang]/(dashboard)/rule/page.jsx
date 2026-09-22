"use client";

import PageLayout from "@/components/page-layout";
import { DynamicForm } from "@/components/form/dynamic-form";
import { useRule } from "@/domains/rule/hook/useRule";
import fields from "./config/fields";
import fieldsPunishment from "./config/fieldsPunishment";

const RulesPage = () => {
    const { ruleState, actions } = useRule();
    const { generalForm, punishmentForm } = ruleState;

    const onSubmit = (values) => {
        if (+values.max_age <= +values.min_age) {
            generalForm.setError("max_age", {
                message: "Maximum age must be greater than minimum age",
            });
            return;
        }
        actions.onUpdate(values);
    };

    const onPunishmentSubmit = (values) => {
        actions.onPunishmentUpdate(values);
    };

    return (
        <PageLayout>
            {/* GENERAL RULE */}
            <h2 className="text-xl font-bold mb-4">General Rule</h2>
            <div className="bg-white p-6 rounded-md shadow">
                <DynamicForm
                    form={generalForm}
                    fields={fields()}
                    onSubmit={onSubmit}
                    submitLabel={null}
                />

                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={generalForm.handleSubmit(onSubmit)}
                        className="bg-primary text-white px-5 py-2 rounded-md"
                    >
                        Save General Rules
                    </button>
                </div>
            </div>

            {/* PUNISHMENT RULE */}
            <h2 className="text-xl font-bold my-4">Punishment Rule</h2>
            <div className="bg-white p-6 rounded-md shadow">
                <DynamicForm
                    form={punishmentForm}
                    fields={fieldsPunishment(punishmentForm)}
                    onSubmit={onPunishmentSubmit}
                    submitLabel={null}
                />

                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={punishmentForm.handleSubmit(
                            onPunishmentSubmit,
                        )}
                        className="bg-primary text-white px-5 py-2 rounded-md"
                    >
                        Save Punishment Rules
                    </button>
                </div>
            </div>
        </PageLayout>
    );
};

export default RulesPage;
