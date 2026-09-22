"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import { DynamicForm } from "@/components/form/dynamic-form";
import ReportActions from "@/components/report/ReportActions";
import formFields from "./config/fields";
import columns from "./config/columns";
import { useReport } from "@/domains/report/hook/useReport";
import { useGenerateReportMutation } from "@/domains/report/services/reportApi";
import toast from "react-hot-toast";

const openBase64Pdf = (base64) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const blob = new Blob([new Uint8Array(byteNumbers)], {
        type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 10000);
};

const PaySlipReportPage = () => {
    const { actions, reportState } = useReport("report/pay-slip", "pay-slip");
    const [generateReport, { isLoading }] = useGenerateReportMutation();

    const handlePdf = async (salary) => {
        try {
            const response = await generateReport({
                route: `pay-slip/${salary.id}`,
                filters: {},
                format: "pdf",
            }).unwrap();

            if (response?.pdf) {
                openBase64Pdf(response.pdf);
                return;
            }

            toast.error("Failed to generate pay slip PDF.");
        } catch (error) {
            const message =
                error?.data?.message ||
                error?.error ||
                error?.message ||
                "Failed to generate pay slip PDF.";
            toast.error(message);
        }
    };

    return (
        <PageLayout>
            <div className="bg-white p-6 rounded-md shadow mb-6">
                <DynamicForm
                    form={reportState.form}
                    fields={formFields(reportState.form)}
                    onSubmit={() => actions.handleAction("filter")}
                />

                <ReportActions
                    form={reportState.form}
                    onAction={actions.handleAction}
                    onReset={actions.onReset}
                    showPdf={false}
                    showExcel={false}
                    showPrint={false}
                />
            </div>

            <BasicTableLayout
                columns={columns({ onPdf: handlePdf, isLoading })}
                state={reportState}
                search
                addPermission={null}
            />
        </PageLayout>
    );
};

export default PaySlipReportPage;
