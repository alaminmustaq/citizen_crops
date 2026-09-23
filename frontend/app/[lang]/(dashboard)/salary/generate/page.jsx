"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "./config/columns";
import fields from "./config/fields";
import BasicModel from "@/components/model/basic-model";
import { useSalary } from "@/domains/salary/hook/useSalary";
import ApprovedFields from "./config/ApprovedFields";

const SalaryGeneratePage = () => {
    const { actions, salaryState } = useSalary(); // Use salaryState from hook

    return (
        <PageLayout>
            <BasicTableLayout
                addPermission={"generate_salary"}
                addButtonLabel={{"GenerateSalary":{
                    label: "Generate Salary",
                    action: actions.onGenerateSalary
                },"ApprovedSalary":{
                    label: "Approved Salary",
                    action: actions.onApproveSalary
                }}}
                columns={columns(actions)}
                state={salaryState }
                filterCustom={{
                    salary_month: {
                        multiple: true,
                        values: [
                            { key: "1", value: "January" },
                            { key: "2", value: "February" },
                            { key: "3", value: "March" },
                            { key: "4", value: "April" },
                            { key: "5", value: "May" },
                            { key: "6", value: "June" },
                            { key: "7", value: "July" },
                            { key: "8", value: "August" },
                            { key: "9", value: "September" },
                            { key: "10", value: "October" },
                            { key: "11", value: "November" },
                            { key: "12", value: "December" },
                        ],
                    }
                }}
                
            />
            <BasicModel
                title={
                    salaryState?.form?.watch("model_for") == "approved_salary"
                        ? "Approved Salary"
                        : "Generate Salary"
                }
                submitLabel={
                    salaryState?.form?.watch("model_for") == "approved_salary"
                        ? "Approved"
                        : "Generate"
                }
                cancelLabel="Cancel"
                size="2xl"
                form={salaryState.form} 
                fields={
                    salaryState?.form?.watch("model_for") == "approved_salary"
                        ? ApprovedFields(actions)
                        : fields(actions)
                }
                actions={actions}
            />
        </PageLayout>
    );
};

export default SalaryGeneratePage;
