"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import fields from "./config/fields";
import { DynamicForm } from "@/components/form/dynamic-form";
import filterFields from "./config/filterFields";
import ReportActions from "@/components/report/ReportActions";
import { useEffect, useState } from "react";
import CollapsibleToggleButton from "@/components/ui/CollapsibleToggleButton";
import { useEmailTemplate } from "@/domains/email-template/hook/useEmailTemplate";
import emailTemplateTags from "./config/emailTemplateTags";

const PlaceholderPanel = ({ onInsert, activeField }) => {
    return (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900">
                        Insert Placeholders
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Click a placeholder to insert it into the active field.
                        These values will be replaced automatically when sending.
                    </p>
                </div>

                <div className="inline-flex shrink-0 items-center whitespace-nowrap rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    <span>Inserting into:</span>
                    <span className="ml-1 font-semibold capitalize">
                        {activeField === "subject" ? "Subject" : "Message"}
                    </span>
                </div>
            </div>

            <div className="space-y-5">
                {emailTemplateTags.map((section) => (
                    <div key={section.group}>
                        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {section.group}
                        </h4>

                        <div className="flex flex-wrap gap-2">
                            {section.items.map((item) => (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => onInsert(item.value)}
                                    className="rounded-md border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const addSmartSpacing = (text, insertAt, tag) => {
    const beforeChar = text[insertAt - 1] || "";
    const afterChar = text[insertAt] || "";

    const needsSpaceBefore =
        insertAt > 0 &&
        beforeChar !== " " &&
        beforeChar !== "\n" &&
        beforeChar !== "\t" &&
        beforeChar !== "(";

    const needsSpaceAfter =
        afterChar &&
        afterChar !== " " &&
        afterChar !== "\n" &&
        afterChar !== "\t" &&
        afterChar !== "." &&
        afterChar !== "," &&
        afterChar !== "!" &&
        afterChar !== "?" &&
        afterChar !== ")" &&
        afterChar !== ":" &&
        afterChar !== ";";

    return `${needsSpaceBefore ? " " : ""}${tag}${needsSpaceAfter ? " " : ""}`;
};

const EmailTemplatePage = () => {
    const { actions, emailTemplateState } = useEmailTemplate();
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [activeField, setActiveField] = useState("message");

    const formValues = emailTemplateState.form.watch();

    useEffect(() => {
        const focusHandler = (event) => {
            const target = event.target;
            if (!target) return;

            if (target.name === "subject") {
                setActiveField("subject");
            }
        };

        const messageFieldHandler = (event) => {
            if (event?.detail?.field === "message") {
                setActiveField("message");
            }
        };

        document.addEventListener("focusin", focusHandler);
        window.addEventListener(
            "email-template-active-field",
            messageFieldHandler,
        );

        return () => {
            document.removeEventListener("focusin", focusHandler);
            window.removeEventListener(
                "email-template-active-field",
                messageFieldHandler,
            );
        };
    }, []);

    const insertIntoSubject = (tag) => {
        const form = emailTemplateState.form;
        const currentValue = form.getValues("subject") || "";

        const subjectInput =
            document.querySelector('input[name="subject"]') ||
            document.querySelector('textarea[name="subject"]');

        if (!subjectInput) {
            form.setValue("subject", `${currentValue} ${tag}`.trim(), {
                shouldDirty: true,
                shouldValidate: true,
            });
            return;
        }

        const start = subjectInput.selectionStart ?? currentValue.length;
        const end = subjectInput.selectionEnd ?? currentValue.length;

        const tagToInsert = addSmartSpacing(currentValue, start, tag);

        const newValue =
            currentValue.slice(0, start) +
            tagToInsert +
            currentValue.slice(end);

        form.setValue("subject", newValue, {
            shouldDirty: true,
            shouldValidate: true,
        });

        requestAnimationFrame(() => {
            subjectInput.focus();
            const cursor = start + tagToInsert.length;
            subjectInput.setSelectionRange(cursor, cursor);
        });
    };

    const insertIntoMessage = (tag) => {
        window.dispatchEvent(
            new CustomEvent("email-template-insert-message-tag", {
                detail: { tag },
            }),
        );
    };

    const handleInsertPlaceholder = (tag) => {
        if (activeField === "subject") {
            insertIntoSubject(tag);
            return;
        }

        insertIntoMessage(tag);
    };

    const isEdit = !!emailTemplateState?.form?.watch("id");

    return (
        <PageLayout>
            <div className="mb-4 flex items-center justify-between">
                <CollapsibleToggleButton
                    isOpen={filtersOpen}
                    onToggle={() => setFiltersOpen((prev) => !prev)}
                />
            </div>

            {filtersOpen && (
                <div className="mb-6 rounded-md bg-white p-6 shadow transition-all duration-300">
                    <DynamicForm
                        form={emailTemplateState.form}
                        fields={filterFields(emailTemplateState.form)}
                        onSubmit={() => actions.onFilter}
                    />
                    <ReportActions
                        form={emailTemplateState.form}
                        onAction={actions.onFilter}
                        onReset={actions.onReset}
                        showPdf={false}
                        showExcel={false}
                    />
                </div>
            )}

            <BasicTableLayout
                addPermission={"create-email-template"}
                addButtonLabel="Add Template"
                columns={columns(actions)}
                state={emailTemplateState}
            />

            <BasicModel
                title={isEdit ? "Edit Template" : "Create Template"}
                submitLabel={isEdit ? "Update" : "Create"}
                cancelLabel="Cancel"
                size="3xl"
                form={emailTemplateState.form}
                fields={fields(formValues)}
                actions={actions}
                alwaysShowChildren={true}
            >
                <PlaceholderPanel
                    onInsert={handleInsertPlaceholder}
                    activeField={activeField}
                />
            </BasicModel>
        </PageLayout>
    );
};

export default EmailTemplatePage;
