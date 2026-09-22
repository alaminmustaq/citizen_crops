import { useFetchNotificationQuery } from "../services/allNotificationApi";
import { useForm } from "react-hook-form";

export const useAllNotification = () => { 
  const { data, refetch, isFetching } = useFetchNotificationQuery();

  const form = useForm({
    mode: "onBlur",
    reValidateMode: "onSubmit",
    shouldFocusError: true,
  });

  const notificationState = {
    data: data?.data?.notifications || [],
    form,
    refetch,
    pagination: data?.data?.pagination || {},
    isFetching,
  }; 

  return {
    notificationState,
  };
};
