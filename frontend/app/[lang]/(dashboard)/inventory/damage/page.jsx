"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import fields from "./config/fields";
import { useDamage } from "@/domains/inventory/damage/hook/useDamage";

const DamagePage = () => {
  const { actions, damageState } = useDamage();

  return (
      <PageLayout>
          <BasicTableLayout
              addPermission={"create-tool-damage"}
              addButtonLabel="Add Tool Damage"
              columns={columns(actions)}
              state={damageState}
          />

          <BasicModel
              title={
                  damageState?.form?.watch("id")
                      ? "Edit Tool Damage"
                      : "Create Tool Damage"
              }
              submitLabel={
                  damageState?.form?.watch("id") ? "Update" : "Create"
              }
              cancelLabel="Cancel"
              size="5xl"
              form={damageState.form}
              fields={fields(damageState.form)}
              actions={actions}
          />
      </PageLayout>
  );
};

export default DamagePage;