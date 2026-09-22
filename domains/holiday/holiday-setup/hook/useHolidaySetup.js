import {
  handleServerValidationErrors,
  formReset,
} from "@/utility/helpers";
import {
  useCreateHolidayMutation,
  useUpdateHolidayMutation,
  useDeleteHolidayMutation,
  useFetchHolidayQuery,
} from "../services/holidaySetupApi";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { 
  holidayTypeSearchTemplate
} from "@/utility/templateHelper";


export const useHolidaySetup = () => {
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
    data: holidayData?.data?.holiday_setups || [],
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
    formatDateForForm: (dateString) => {
            if (!dateString) return "";
            try {
                const date = new Date(dateString); // create date from your string
                date.setDate(date.getDate() + 1); // add 1 day
                return date.toISOString().split("T")[0]; // format as YYYY-MM-DD
            } catch (error) {
                console.error("Date formatting error:", error);
                return "";
            }
        },
    onCreate: async (data) => {
      try {
        const { openModel, ...payload } = data;
        // Normalize all fields (recursive version if needed)
        const preparedData = normalizeFieldValueRecursive(payload);

        const response = await createHoliday(preparedData).unwrap();

        

        if (response) {
          toast.success("Holiday Setup Created successfully");
          refetch();
          formReset(form);
          form.setValue("openModel", false);
        }
      } catch (apiErrors) {
        handleServerValidationErrors(apiErrors, form.setError);
        toast.error("Failed to Create holiday setup");
      }
    },

    onEdit: (item) => {
      console.log(item);
      
      form.reset({
        id: item.id || "",
        name: item.name || "",
        holiday_type_id:
                    holidayTypeSearchTemplate(item?.holiday_type ? [item.holiday_type] : [])?.at(
                        0
                    ) ?? null, 
        start_date: actions.formatDateForForm(item.start_date) || "",
        end_date: actions.formatDateForForm(item.end_date) || "",
        description: item.description || "",         // NEW: description
        status: item.status || "active",             // keep status
        openModel: true,                              // open modal
      });

      form.setValue("openModel", true);
    },

    onUpdate: async (data) => {
      try {
        const { openModel, id, ...payload } = data;
        const preparedData = normalizeFieldValueRecursive(payload);

        const response = await updateHoliday({ id, ...preparedData }).unwrap();

        if (response) {
          toast.success("Holiday Setup updated successfully");
          refetch();
          formReset(form);
          form.setValue("openModel", false);
        }
      } catch (apiErrors) {
        handleServerValidationErrors(apiErrors, form.setError);
        toast.error("Failed to update holiday setup");
      }
    },

    onDelete: async (id) => {
      try {
        if (!confirm("Are you sure you want to delete this holiday setup?")) return;

        const response = await deleteHoliday(id).unwrap();

        if (response) {
          toast.success("Holiday Setup deleted successfully");
          refetch();
        } else {
          toast.error("Failed to delete holiday setup");
        }
      } catch (error) {
        console.error("Delete holiday error:", error);
        toast.error("Something went wrong while deleting holiday setup.");
      }
    },
  };
  const normalizeFieldValueRecursive = (value) => {
        if (Array.isArray(value)) {
            return value.map(normalizeFieldValueRecursive);
        }
        if (value instanceof Set) {
            return Array.from(value).map(normalizeFieldValueRecursive);
        }
        if (typeof value === "object" && value !== null) {
            if ("value" in value && Object.keys(value).length === 2 && "label" in value) {
                return value.value;
            }
            // For nested objects
            return Object.fromEntries(
                Object.entries(value).map(([k, v]) => [k, normalizeFieldValueRecursive(v)])
            );
        }
        return value;
    };
  return {
    actions,
    holidayState,
  };
};
