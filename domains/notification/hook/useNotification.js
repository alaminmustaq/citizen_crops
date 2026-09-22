import { useMarkAllAsReadMutation } from "../services/notificationApi";
import toast from "react-hot-toast";

export const useNotification = () => {
    const [markAll] = useMarkAllAsReadMutation();

    const actions = {
        markAllAsRead: async (setCount) => {
            try {
                const response = await markAll().unwrap();
                toast.success("All notifications marked as read!");
                setCount(0);
                return response;
            } catch (err) {
                toast.error("Failed to update notifications");
                console.error(err);
            }
        },
    };

    return { actions };
};
