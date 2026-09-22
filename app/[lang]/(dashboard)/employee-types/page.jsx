"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import fields from "./config/fields";
import { useEmployeeTypes } from "@/domains/employee-types/hook/useEmployeeTypes";

const EmployeeTypesPage = () => {
  const { actions, employeeTypeState } = useEmployeeTypes();

  return (
    <PageLayout>
      <BasicTableLayout
        addPermission={"create-holiday-type"}
        addButtonLabel="Add Employee Types"
        columns={columns(actions)}
        state={employeeTypeState}
      />

      <BasicModel
        title={
          employeeTypeState?.form?.watch("id")
            ? "Edit Employee Types"
            : "Create Employee Types"
        }
        submitLabel={
          employeeTypeState?.form?.watch("id") ? "Update" : "Create"
        }
        cancelLabel="Cancel"
        size="2xl"
        form={employeeTypeState.form}
        fields={fields}
        actions={actions} // pass the full CRUD actions
      />
    </PageLayout>
  );
};

export default EmployeeTypesPage;
