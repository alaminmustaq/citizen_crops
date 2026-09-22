const filterFields = (jobs = []) => [
    {
        name: "job_id",
        label: "Job Position",
        type: "select",
        placeholder: "Select Job",
        options: jobs.map((job) => ({
            value: job.id,
            label: job.job_title,
        })),
        colSpan: "col-span-12 md:col-span-4",
    },
    {
        name: "status",
        label: "Status",
        type: "select",
        placeholder: "All Status",
        options: [
            { value: "applied", label: "Applied" },
            { value: "confirmed", label: "Confirmed" },
            { value: "rejected", label: "Rejected" },
            { value: "interview", label: "Interview" },
        ],
        colSpan: "col-span-12 md:col-span-4",
    },
];

export default filterFields;
