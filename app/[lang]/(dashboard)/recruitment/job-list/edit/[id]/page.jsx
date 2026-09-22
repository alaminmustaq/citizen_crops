"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import DynamicTabForm from "@/components/form/dynamic-tab-form";
import PageLayout from "@/components/page-layout";
import fields from "../../config/fields";
import { useJobList } from "@/domains/recruitment/job-list/hook/useJobList";
import { useFetchJobDetailsQuery } from "@/domains/recruitment/job-list/services/jobListApi";

const JobEdit = () => {
    const { id } = useParams();
    const { actions, jobListState } = useJobList();
    const { data: jobData, isLoading, isError } = useFetchJobDetailsQuery(id, {
        skip: !id,
    });

    useEffect(() => {
        if (jobData?.data) {
            jobListState.form.reset({
                ...jobData.data,
            });
        }
    }, [jobData, jobListState.form]);

    if (isLoading) {
        return (
            <PageLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 text-primary font-medium">Loading Job Details...</span>
                </div>
            </PageLayout>
        );
    }

    if (isError) {
        return (
            <PageLayout>
                <div className="text-center py-10">
                    <h2 className="text-2xl font-bold text-destructive">Error Loading Job</h2>
                    <p className="mt-2 text-muted-foreground">The job listing you're trying to edit could not be found or there was a server error.</p>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout
            title="Edit Job Listing"
            breadcrumb={[{ label: "Job List", link: "/recruitment/job-list" }, { label: "Edit Job" }]}
        >
            <div className="mt-6">
                <DynamicTabForm
                    isServerValidated={false}
                    fields={fields}
                    form={jobListState.form}
                    actions={actions}
                    onSubmit={actions.onUpdate}
                    stepperClassName="max-w-2xl mx-auto mb-6"
                />
            </div>
        </PageLayout>
    );
};

export default JobEdit;
