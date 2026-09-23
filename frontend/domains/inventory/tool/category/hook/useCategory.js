import {
  handleServerValidationErrors,
  formReset,
} from "@/utility/helpers";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../services/categoryApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

export const useCategory = () => {
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const { data: categoryData, refetch, isFetching } = useFetchCategoriesQuery();

  const form = useForm({
    mode: "onBlur",
    reValidateMode: "onSubmit",
    shouldFocusError: true,
  });

  const categoryState = {
    data: categoryData?.data?.categories || [],
    form,
    refetch,
    pagination: categoryData?.data?.pagination || {},
    isFetching,
  };

  const actions = {
    onCreate: async (data) => {
      try {
        const { openModel, ...payload } = data;
        const response = await createCategory(payload).unwrap();

        if (response) {
          toast.success("Category created successfully");
          refetch();
          formReset(form);
          form.setValue("openModel", false);
        }
      } catch (apiErrors) {
        handleServerValidationErrors(apiErrors, form.setError);
        toast.error("Failed to create category");
      }
    },

    onEdit: (item) => {
      form.reset({
        id: item.id || "",
        name: item.name || "",
        status: item.status || "active", // include status here
      });
      form.setValue("openModel", true);
    },

    onUpdate: async (data) => {
      try {
        const { openModel, id, ...payload } = data;
        const response = await updateCategory({ id, ...payload }).unwrap();

        if (response) {
          toast.success("Category updated successfully");
          refetch();
          formReset(form);
          form.setValue("openModel", false);
        }
      } catch (apiErrors) {
        handleServerValidationErrors(apiErrors, form.setError);
        toast.error("Failed to update category");
      }
    },

    onDelete: async (id) => {
      try {
        if (!confirm("Are you sure you want to delete this category?")) return;

        const response = await deleteCategory(id).unwrap();

        if (response) {
          toast.success("Category deleted successfully");
          refetch();
        } else {
          toast.error("Failed to delete category");
        }
      } catch (error) {
        console.error("Delete category error:", error);
        toast.error("Something went wrong while deleting category.");
      }
    },
  };

  return {
    actions,
    categoryState,
  };
};
