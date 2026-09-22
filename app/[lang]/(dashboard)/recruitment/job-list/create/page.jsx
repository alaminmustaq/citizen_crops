"use client";
import React from "react";
import DynamicTabForm from "@/components/form/dynamic-tab-form";
import PageLayout from "@/components/page-layout";
import fields from "../config/fields";
import { useJobList } from "@/domains/recruitment/job-list/hook/useJobList";

const JobCreate = () => {
    const { actions, jobListState } = useJobList();

    return (
        <PageLayout>
            <DynamicTabForm
                isServerValidated={false}
                addPermission={"view-project"} // Adjust permission as needed
                fields={fields}
                form={jobListState.form}
                actions={actions}
                onSubmit={actions.onCreate}
                stepperClassName="max-w-2xl mx-auto mb-6"
            />
        </PageLayout>
    );
};

export default JobCreate;
