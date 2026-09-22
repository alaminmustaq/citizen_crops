import { formatDateTime } from "@/lib/utils";

const notificationColumns = (actions) => [
  {
    accessorKey: "type",
    header: "Type",
    thClass: "!text-left",
    tdClass: "!text-left",
  },
  {
    accessorKey: "data",
    header: "Message",
    thClass: "!text-left",
    tdClass: "!text-left",
    cell: ({ row }) => {
      try {
        const data = JSON.parse(row.original.data);
        return data.message || "-";
      } catch {
        return row.original.data || "-";
      }
    },
  },
  {
    accessorKey: "read_at",
    header: "Status",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => {
      const isRead = !!row.original.read_at;
      return (
        <span
          className={
            isRead
              ? "bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
              : "bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full"
          }
        >
          {isRead ? "Read" : "Unread"}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    thClass: "!text-center",
    tdClass: "!text-center",
    cell: ({ row }) => formatDateTime(row.original.created_at) || "-",
  }, 
];

export default notificationColumns;
