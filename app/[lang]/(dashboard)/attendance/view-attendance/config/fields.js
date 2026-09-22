import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const fields = (actions, form) => [
    {
        name: "check_in_time",
        label: "Check-in Time",
        type: "time",
        required: true,
        placeholder: "Select Check-in Time",
        col: "col-span-12 md:col-span-6",
    },
    {
        name: "check_out_time",
        label: "Check-out Time",
        type: "time",
        required: true,
        placeholder: "Select Check-out Time",
        col: "col-span-12 md:col-span-6",
    },
];

export default fields;
