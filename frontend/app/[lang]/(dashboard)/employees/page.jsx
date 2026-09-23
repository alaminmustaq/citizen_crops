"use client";
import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import columns from "./config/columns";

import { useEmploy } from "@/domains/employ/hook/useEmploy";

const EmployeePage = () => {
    const { actions, employState } = useEmploy();

    return (
        <PageLayout>
            <BasicTableLayout
                addPermission={"create-employee"}
                addButtonLabel="Add Employee"
                columns={columns(actions)}
                to="employees/create"
                state={employState}
                searchKey="employee"
            />
        </PageLayout>
    );
};

export default EmployeePage;
