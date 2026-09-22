import {
  handleServerValidationErrors,
  formReset,
} from "@/utility/helpers";
import {
  useCreateLeaveMutation,
  useUpdateLeaveMutation,
  useDeleteLeaveMutation,
  useFetchLeaveQuery,
} from "../services/leaveReasonApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

export const useLeaveReason = () => {
  const [createLeave] = useCreateLeaveMutation();
  const [updateLeave] = useUpdateLeaveMutation();
  const [deleteLeave] = useDeleteLeaveMutation();
  const { data: leaveData, refetch, isFetching } = useFetchLeaveQuery();

  const form = useForm({
    mode: "onBlur",
    reValidateMode: "onSubmit",
    shouldFocusError: true,
  });

  const defaultValue = {
        status: "active",
    };

  const leaveState = {
    data: leaveData?.data?.leave_reasons || [],
     form: {
            ...form,
            defaultValue: defaultValue,
        },
    refetch,
    pagination: leaveData?.data?.pagination || {},
    isFetching,
  };
  // console.log(leaveData);
  
  const actions = {
    onCreate: async (data) => {
      try {
        const { openModel, ...payload } = data;
        const response = await createLeave(payload).unwrap();

        if (response) {
          toast.success("Leave Reason Created successfully");
          refetch();
          formReset(form);
          form.setValue("openModel", false);
        }
      } catch (apiErrors) {
        handleServerValidationErrors(apiErrors, form.setError);
        toast.error("Failed to Create leave reason");
      }
    },

    onEdit: (item) => {
      form.reset({
        id: item.id || "",
        name: item.name || "",
        status: item.status || "active",        // keep status
        openModel: true,                         // open modal
      });
      form.setValue("openModel", true);
    },

    onUpdate: async (data) => {
      try {
        const { openModel, id, ...payload } = data;
        const response = await updateLeave({ id, ...payload }).unwrap();

        if (response) {
          toast.success("Leave Reason updated successfully");
          refetch();
          formReset(form);
          form.setValue("openModel", false);
        }
      } catch (apiErrors) {
        handleServerValidationErrors(apiErrors, form.setError);
        toast.error("Failed to update leave reason");
      }
    },

    onDelete: async (id) => {
      try {
        if (!confirm("Are you sure you want to delete this leave reason?")) return;

        const response = await deleteLeave(id).unwrap();

        if (response) {
          toast.success("Leave Reason deleted successfully");
          refetch();
        } else {
          toast.error("Failed to delete leave reason");
        }
      } catch (error) {
        console.error("Delete leave error:", error);
        toast.error("Something went wrong while deleting leave reason.");
      }
    },
  };

  return {
    actions,
    leaveState,
  };
};
