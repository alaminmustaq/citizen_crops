import {
  handleServerValidationErrors,
  formReset,
} from "@/utility/helpers";
import {
  useCreateHolidayMutation,
  useUpdateHolidayMutation,
  useDeleteHolidayMutation,
  useFetchHolidayQuery,
} from "../services/holidayReasonApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

export const useHolidayReason = () => {
  const [createHoliday] = useCreateHolidayMutation();
  const [updateHoliday] = useUpdateHolidayMutation();
  const [deleteHoliday] = useDeleteHolidayMutation();
  const { data: holidayData, refetch, isFetching } = useFetchHolidayQuery();

  const form = useForm({
    mode: "onBlur",
    reValidateMode: "onSubmit",
    shouldFocusError: true,
  });

  const defaultValue = {
        status: "active",
    };

  const holidayState = {
    data: holidayData?.data?.holiday_reasons || [],
     form: {
            ...form,
            defaultValue: defaultValue,
        },
    refetch,
    pagination: holidayData?.data?.pagination || {},
    isFetching,
  };
  // console.log(holidayData);
  
  const actions = {
    onCreate: async (data) => {
      try {
        const { openModel, ...payload } = data;
        const response = await createHoliday(payload).unwrap();

        if (response) {
          toast.success("Holiday Reason Created successfully");
          refetch();
          formReset(form);
          form.setValue("openModel", false);
        }
      } catch (apiErrors) {
        handleServerValidationErrors(apiErrors, form.setError);
        toast.error("Failed to Create holiday reason");
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
        const response = await updateHoliday({ id, ...payload }).unwrap();

        if (response) {
          toast.success("Holiday Reason updated successfully");
          refetch();
          formReset(form);
          form.setValue("openModel", false);
        }
      } catch (apiErrors) {
        handleServerValidationErrors(apiErrors, form.setError);
        toast.error("Failed to update holiday reason");
      }
    },

    onDelete: async (id) => {
      try {
        if (!confirm("Are you sure you want to delete this holiday reason?")) return;

        const response = await deleteHoliday(id).unwrap();

        if (response) {
          toast.success("Holiday Reason deleted successfully");
          refetch();
        }
      } catch (error) {
        console.error("Delete holiday reason error:", error);

        const apiMessage =
          error?.data?.errors?.error ||
          error?.data?.message ||
          "Something went wrong while deleting holiday reason.";

        toast.error(apiMessage);
      }
    },
  };

  return {
    actions,
    holidayState,
  };
};
