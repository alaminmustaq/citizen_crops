"use client";
import React from "react";
import Card from "@/components/ui/card-snippet";
import DynamicTabForm from "@/components/form/dynamic-tab-form";
import PageLayout from "@/components/page-layout";
import fields from "../../config/fields";
import { useEmploy } from "@/domains/employ/hook/useEmploy";
import { useAppSelector } from "@/hooks/use-redux";
import { useEffect } from "react";

const employCreate = () => {
    const { actions, employState } = useEmploy(); // Custom hook to manage user actions
    const { employData } = useAppSelector((state) => state.employ);
    useEffect(() => {
        actions.onEdit(employData);
    }, [employData]);

    return (
        <PageLayout>
            <Card>
                <DynamicTabForm
                    isServerValidated={true}
                    fields={fields}
                    form={employState.form}
                    actions={actions}
                />
            </Card>
        </PageLayout>
    );
};

export default employCreate;
