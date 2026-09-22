import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { formReset, handleServerValidationErrors } from "@/utility/helpers";
import {
  useCreateEmployeeTypeMutation,
  useUpdateEmployeeTypeMutation,
  useDeleteEmployeeTypeMutation,
  useFetchEmployeeTypesQuery,
} from "../services/employeeTypesApi";

export const useEmployeeTypes = () => {
  const [createEmployeeType] = useCreateEmployeeTypeMutation();
  const [updateEmployeeType] = useUpdateEmployeeTypeMutation();
  const [deleteEmployeeType] = useDeleteEmployeeTypeMutation();
  const { data: employeeTypeData, refetch, isFetching } = useFetchEmployeeTypesQuery();

  const form = useForm({
    mode: "onBlur",
    reValidateMode: "onSubmit",
    shouldFocusError: true,
  });

  const defaultValue = {
    status: "active",
  };

  const employeeTypeState = {
    data: employeeTypeData?.data?.employee_types || [],
    form: {
      ...form,
      defaultValue,
    },
    refetch,
    pagination: employeeTypeData?.data?.pagination || {},
    isFetching,
  };

  const actions = {
    onCreate: async (data) => {
      try {
        const { openModel, ...payload } = data;
        const response = await createEmployeeType(payload).unwrap();

        if (response) {
          toast.success("Employee type created successfully");
          refetch();
          formReset(form);
          form.setValue("openModel", false);
        }
      } catch (apiErrors) {
        handleServerValidationErrors(apiErrors, form.setError);
        toast.error("Failed to create employee type");
      }
    },

    onEdit: (item) => {
      form.reset({
        id: item.id || "",
        name: item.name || "",
        status: item.status || "active",
        description: item.description || "",
        openModel: true,
      });
      form.setValue("openModel", true);
    },

    onUpdate: async (data) => {
      try {
        const { openModel, id, ...payload } = data;
        const response = await updateEmployeeType({ id, ...payload }).unwrap();

        if (response) {
          toast.success("Employee type updated successfully");
          refetch();
          formReset(form);
          form.setValue("openModel", false);
        }
      } catch (apiErrors) {
        handleServerValidationErrors(apiErrors, form.setError);
        toast.error("Failed to update employee type");
      }
    },

    onDelete: async (id) => {
      try {
        if (!confirm("Are you sure you want to delete this employee type?")) return;

        const response = await deleteEmployeeType(id).unwrap();

        if (response) {
          toast.success("Employee type deleted successfully");
          refetch();
        }
      } catch (error) {
        console.error("Delete employee type error:", error);

        const apiMessage =
          error?.data?.errors?.error ||
          error?.data?.message ||
          "Something went wrong while deleting employee type.";

        toast.error(apiMessage);
      }
    },
  };

  return {
    actions,
    employeeTypeState,
  };
};
