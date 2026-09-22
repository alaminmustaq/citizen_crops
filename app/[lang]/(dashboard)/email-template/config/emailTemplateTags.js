const emailTemplateTags = [
    {
        group: "CANDIDATE",
        items: [
            { label: "Name", value: "{CANDIDATE}" },
            { label: "Email", value: "{CANDIDATE_EMAIL}" },
            { label: "Phone", value: "{CANDIDATE_PHONE}" },
            { label: "Location", value: "{CANDIDATE_LOCATION}" },
            { label: "LinkedIn", value: "{CANDIDATE_LINKEDIN}" },
            { label: "Portfolio", value: "{CANDIDATE_PORTFOLIO}" },
        ],
    },
    {
        group: "JOB",
        items: [
            { label: "Title", value: "{JOB_TITLE}" },
            { label: "Salary", value: "{JOB_SALARY}" },
            { label: "Type", value: "{JOB_TYPE}" },
            { label: "Workspace", value: "{JOB_WORKSPACE}" },
            { label: "Deadline", value: "{JOB_DEADLINE}" },
            { label: "Location", value: "{JOB_LOCATION}" },
        ],
    },
    {
        group: "INTERVIEW",
        items: [
            { label: "Slot", value: "{SLOT}" },
            { label: "Date", value: "{INTERVIEW_DATE}" },
            { label: "Time", value: "{INTERVIEW_TIME}" },
            { label: "Location", value: "{INTERVIEW_LOCATION}" },
            { label: "Meeting Link", value: "{INTERVIEW_LINK}" },
            { label: "Organizer", value: "{INTERVIEW_ORGANIZER}" },
        ],
    },
    {
        group: "COMPANY",
        items: [
            { label: "Name", value: "{COMPANY}" },
            { label: "Contact Info", value: "{CONTACT_INFO}" },
            { label: "Website", value: "{WEBSITE}" },
            { label: "Contact", value: "{CONTACT}" },
        ],
    },
    {
        group: "SENDER",
        items: [
            { label: "Your Name", value: "{USERNAME}" },
            { label: "Your Role", value: "{USER_ROLE}" },
        ],
    },
];

export default emailTemplateTags;
