import {
  handleServerValidationErrors,
  formReset,
} from "@/utility/helpers";
import {
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
  useFetchUnitsQuery,
} from "../services/unitApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

export const useUnit = () => {
  const [createUnit] = useCreateUnitMutation();
  const [updateUnit] = useUpdateUnitMutation();
  const [deleteUnit] = useDeleteUnitMutation();
  const { data: unitData, refetch, isFetching } = useFetchUnitsQuery();

  const form = useForm({
    mode: "onBlur",
    reValidateMode: "onSubmit",
    shouldFocusError: true,
  });

  const unitState = {
    data: unitData?.data?.units || [],
    form,
    refetch,
    isFetching,
  };

  const actions = {
    onCreate: async (data) => {
      try {
        const { openModel, ...payload } = data;
        const response = await createUnit(payload).unwrap();

        if (response) {
          toast.success("Unit created successfully");
          refetch();
          formReset(form);
          form.setValue("openModel", false);
        }
      } catch (apiErrors) {
        handleServerValidationErrors(apiErrors, form.setError);
        toast.error("Failed to create unit");
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
        const response = await updateUnit({ id, ...payload }).unwrap();

        if (response) {
          toast.success("Unit updated successfully");
          refetch();
          formReset(form);
          form.setValue("openModel", false);
        }
      } catch (apiErrors) {
        handleServerValidationErrors(apiErrors, form.setError);
        toast.error("Failed to update unit");
      }
    },

    onDelete: async (id) => {
      try {
        if (!confirm("Are you sure you want to delete this unit?")) return;

        const response = await deleteUnit(id).unwrap();

        if (response) {
          toast.success("Unit deleted successfully");
          refetch();
        } else {
          toast.error("Failed to delete unit");
        }
      } catch (error) {
        console.error("Delete unit error:", error);
        toast.error("Something went wrong while deleting unit.");
      }
    },
  };

  return {
    actions,
    unitState,
  };
};
