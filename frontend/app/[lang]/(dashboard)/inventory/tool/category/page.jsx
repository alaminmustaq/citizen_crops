"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import fields from "./config/fields";
import { useCategory } from "@/domains/inventory/tool/category/hook/useCategory";

const CategoryPage = () => {
    const { actions, categoryState } = useCategory();

    return (
        <PageLayout>
            <BasicTableLayout
                addPermission={"create-tool-category"}
                addButtonLabel="Add Category"
                columns={columns(actions)}
                state={categoryState}
            />

            <BasicModel
                title={
                    categoryState?.form?.watch("id")
                        ? "Edit Category"
                        : "Create Category"
                }
                submitLabel={
                    categoryState?.form?.watch("id") ? "Update" : "Create"
                }
                cancelLabel="Cancel"
                size="2xl"
                form={categoryState.form}
                fields={fields}
                actions={actions} // <-- pass full actions like BranchPage
            />
        </PageLayout>
    );
};

export default CategoryPage;
