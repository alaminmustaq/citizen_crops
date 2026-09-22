"use client";

import PageLayout from "@/components/page-layout";
import BasicTableLayout from "@/components/table/basic-table-layout";
import BasicModel from "@/components/model/basic-model";
import columns from "./config/columns";
import fields from "./config/fields";
import {
    useApproveAttendanceRequestMutation,
    useRejectAttendanceRequestMutation,
    useUpdateAttendanceRequestMutation,
    useViewAttendanceRequestsQuery,
} from "@/domains/attendance/services/attendanceApi";
import useAuth from "@/domains/auth/hooks/useAuth";
import { formReset } from "@/utility/helpers";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const AttendanceRequestPage = () => {
    const { user } = useAuth();
    const roleLevel = Number(user?.user?.roles?.[0]?.level);
    const isEmployee = roleLevel === 3;
    const canDecide = [0, 1, 2].includes(roleLevel);

    const { data, refetch, isFetching } = useViewAttendanceRequestsQuery();
    const [updateRequest, { isLoading: isUpdating }] =
        useUpdateAttendanceRequestMutation();
    const [approveRequest] = useApproveAttendanceRequestMutation();
    const [rejectRequest] = useRejectAttendanceRequestMutation();

    const form = useForm({
        mode: "onBlur",
        defaultValues: {
            openModel: false,
            id: null,
            reason: "",
        },
    });

    const attendanceRequestState = {
        data: data?.data?.items || [],
        form,
        refetch,
        pagination: data?.data?.pagination || {},
        isFetching,
    };

    const actions = {
        isEmployee,
        canDecide,
        onEdit: (request) => {
            form.reset({
                openModel: true,
                id: request.id,
                reason: request.reason || "",
            });
        },
        onUpdate: async (values) => {
            try {
                await updateRequest({
                    id: values.id,
                    reason: values.reason,
                }).unwrap();
                toast.success("Attendance request reason updated");
                formReset(form);
                form.setValue("openModel", false);
                refetch();
            } catch (error) {
                toast.error(
                    error?.data?.message ||
                        "Failed to update attendance request",
                );
            }
        },
        onApprove: async (request) => {
            try {
                await approveRequest(request.id).unwrap();
                toast.success("Attendance request approved");
                refetch();
            } catch (error) {
                toast.error(error?.data?.message || "Failed to approve request");
            }
        },
        onReject: async (request) => {
            try {
                await rejectRequest(request.id).unwrap();
                toast.success("Attendance request rejected");
                refetch();
            } catch (error) {
                toast.error(error?.data?.message || "Failed to reject request");
            }
        },
    };

    return (
        <PageLayout>
            <BasicTableLayout
                columns={columns(actions)}
                state={attendanceRequestState}
                addButtonLabel=""
            />

            <BasicModel
                title="Edit Attendance Request Reason"
                submitLabel="Update"
                cancelLabel="Close"
                size="2xl"
                form={form}
                fields={fields(form, actions)}
                actions={actions}
                isLoading={isUpdating}
            />
        </PageLayout>
    );
};

export default AttendanceRequestPage;
