"use client";
import React from "react";

import DynamicTabForm from "@/components/form/dynamic-tab-form";
import PageLayout from "@/components/page-layout";
import fields from "../config/fields";
import { useEmploy } from "@/domains/employ/hook/useEmploy";

const employCreate = () => {
    const { actions, employState } = useEmploy(); // Custom hook to manage user actions

    return (
        <PageLayout>
            <DynamicTabForm
                isServerValidated={true}
                addPermission={"create-employee"}
                fields={fields}
                form={employState.form}
                actions={actions}
            />
        </PageLayout>
    );
};

export default employCreate;
