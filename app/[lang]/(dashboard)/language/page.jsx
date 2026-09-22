"use client";
import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "./config/columns";
import fields from "./config/fields";
import BasicModel from "@/components/model/basic-model";
import { useLanguage } from "@/domains/language/hook/useLanguage"; // Correct hook

const LanguagePage = () => {
    const { actions, languageState } = useLanguage(); // Language-specific state

    return (
        <PageLayout>
            <BasicTableLayout
                addPermission={"delete-job-position"} // language permission
                addButtonLabel="Add Language"
                columns={columns(actions)}
                state={languageState}
            />
            <BasicModel
                title={
                    languageState?.form?.watch("id")
                        ? "Edit Language"
                        : "Create Language"
                }
                submitLabel={
                    languageState?.form?.watch("id")
                        ? "Update"
                        : "Create"
                }
                cancelLabel="Cancel"
                size="5xl"
                form={languageState.form}
                fields={fields}
                actions={actions}
            />
        </PageLayout>
    );
};

export default LanguagePage;
