import React from "react";
import { format } from "date-fns";
import { TableActions } from "@/components/table/TableActions";
export default function columns(actions) {
    return [
        {
            id: "financial_type",
            header: "Type",
            accessorKey: "financial_type",
        },
        {
            id: "project",
            header: "Project",
            accessorKey: "project_id",
            cell: ({ getValue }) => {
                const v = getValue();
                return v ? v.name : "-";
            },
        },
        {
            id: "transaction_type",
            header: "Transaction",
            accessorKey: "transaction_type",
        },
        {
            id: "transaction_date",
            header: "Date",
            accessorKey: "transaction_date",
            cell: ({ getValue }) => {
                const v = getValue();
                return v ? format(new Date(v), "yyyy-MM-dd") : "-";
            },
        },
        {
            id: "expected_rec_pay_date",
            header: "Expected Rec/Pay Date",
            accessorKey: "expected_rec_pay_date",
            cell: ({ getValue }) => {
                const v = getValue();
                return v ? format(new Date(v), "yyyy-MM-dd") : "-";
            },
        },
        {
            id: "receive_payment_date",
            header: "Receive/Payment Date",
            accessorKey: "receive_payment_date",
            cell: ({ getValue }) => {
                const v = getValue();
                return v ? format(new Date(v), "yyyy-MM-dd") : "-";
            },
        },

        {
            id: "transaction_status",
            header: "Status",
            accessorKey: "transaction_status",
        },
        {
            id: "total_amount",
            header: "Total",
            accessorKey: "total_amount",
            cell: ({ getValue }) => {
                const v = getValue();
                return v != null
                    ? Number(v).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                      })
                    : "0.00";
            },
        },
        {
            id: "details",
            header: "Details",
            accessorKey: "details",
            cell: ({ row }) => {
                const details = row.original.details || [];
                if (!details.length) return "0 items";

                return (
                    <div className="text-xs">
                        <div>{`${details.length} item${
                            details.length > 1 ? "s" : ""
                        }`}</div>
                    </div>
                );
            },
        },
        // Actions
        {
            id: "actions",
            enableHiding: false,
            header: " ",
            thClass: "!text-center w-[70px] whitespace-nowrap",
            tdClass: "!text-center w-[70px] whitespace-nowrap",
            cell: ({ row }) => 
             {

                let makeActions =[];
                if (row.original.transaction_type == "future_payment"){
                    makeActions.push({
                        label: "Mark as Paid",
                        onClick: actions?.onMarkAsPaid,
                        passId: false,
                         permission: "pay-now"
                    });
                }
                if (row.original.transaction_type == "repeat"){

                    makeActions.push({
                        label: "Pay Now",
                        onClick: actions?.payNow,
                        passId: false,
                         permission: "pay-now"
                    });
                }
                    makeActions.push({
                        label: "Edit",
                        onClick: actions?.onEdit,
                        passId: false,
                        permission: "edit-financial-records"

                    });
             
               
                    makeActions.push( { label: "Delete", onClick: actions?.onDelete, danger: true, passId: true , permission: "delete-financial-records"});
                

               return    (
                     <TableActions
                    data={row.original}
                    label="Actions"
                    
                    // alignmentClass is omitted here, so it defaults to "flex justify-center"
                    items={makeActions}
                />
                  )
             }
            ,
        },
    ];
}
