import {
    LayoutDashboard,
    BarChart2,
    Building2,
    GitBranch,
    Building,
    Briefcase,
    Users,
    UserCircle,
    QrCode,
    ScanLine,
    Settings,
    Shield,
    Banknote,
    FileCheck,
    FileText,
    FileCode,
    FolderKanban,
    ClipboardList,
    UserCheck,
    UserCog,
    UserSquare,
    Hammer,
    LayoutGrid,
    Scale,
    Boxes,
    ShoppingCart,
    ShoppingBasket,
    AlertTriangle,
    Warehouse,
    Framer,
    BadgeDollarSign,
    BadgeDollarSignIcon,
    Type,
    CalendarClock,
    CalendarSearch,
    CalendarPlus,
    Landmark,
    Coins,
    Gavel,
    Gift,
} from "lucide-react";

export const menusConfig = {
    mainNav: [
        {
            title: "Dashboard",
            icon: LayoutDashboard,
            child: [
                {
                    title: "Analytics",
                    href: "/dashboard",
                    icon: BarChart2,
                    permission: "view-dashboard",
                },
            ],
        },
        {
            title: "Organization",
            icon: Building2,
            child: [
                {
                    title: "Company list",
                    href: "/company",
                    icon: Building2,
                    permission: "view-company",
                },
                {
                    title: "Branch list",
                    href: "/branch",
                    icon: GitBranch,
                    permission: "view-branch",
                },
                {
                    title: "Department list",
                    href: "/department",
                    icon: Building,
                    permission: "view-department",
                },
                {
                    title: "Job Position list",
                    href: "/job-position",
                    icon: Briefcase,
                    permission: "view-job-position",
                },
            ],
        },
        {
            title: "Employees",
            icon: Users,
            child: [
                {
                    title: "Employee Type",
                    href: "/employee-types",
                    icon: UserCircle,
                    permission: "view-employee",
                },
                {
                    title: "Employee list",
                    href: "/employees",
                    icon: UserCircle,
                    permission: "view-employee",
                },
                {
                    title: "View Attendance",
                    href: "/attendance/view-attendance",
                    icon: UserCircle,
                    permission: "view-qr-attendance",
                },
                {
                    title: "Manual Attendance",
                    href: "/attendance/manual-attendance",
                    icon: UserCheck,
                    permission: "manual-attendance",
                },
                {
                    title: "Generate QR Code",
                    href: "/generate-qr",
                    icon: QrCode,
                    permission: "generate-qr",
                },
                {
                    title: "QR Attendance",
                    href: "/attendance/qr-attendance",
                    icon: ScanLine,
                    permission: "view-attendance",
                },
                {
                    title: "Attendance Request",
                    href: "/attendance/attendance-request",
                    icon: UserCheck,
                    permission: "view-attendance-request",
                },
                {
                    title: "Salary Generate",
                    href: "/salary/generate",
                    icon: Banknote,
                    permission: "view-salary",
                },
                {
                    title: "Overtime",
                    href: "/overtime",
                    icon: Banknote,
                    permission: "manual-attendance",
                },
                {
                    title: "Advance",
                    href: "/hrm/advance",
                    icon: Banknote,
                    permission: "manual-attendance",
                },
            ],
        },
        {
            title: "Break",
            icon: UserCheck,
            child: [
                {
                    title: "Break Reasons",
                    href: "/attendance/break-reasons",
                    icon: ClipboardList,
                    permission: "view-break-reason",
                },
                {
                    title: "Break List",
                    href: "/attendance/break-list",
                    icon: UserCheck,
                    permission: "view-break-list",
                },
            ],
        },
        {
            title: "Leave",
            icon: CalendarPlus,
            child: [
                {
                    title: "Leave Type",
                    href: "/leave/leave-types",
                    icon: UserCircle,
                    permission: "view-leave-type",
                },
                {
                    title: "Leave Reason",
                    href: "/leave/leave-reasons",
                    icon: UserCircle,
                    permission: "view-leave-reason",
                },
                {
                    title: "Leave Application",
                    href: "/leave/leave-application",
                    icon: UserCircle,
                    permission: "view-leave",
                },
            ],
        },
        {
            title: "Holiday",
            icon: CalendarSearch,
            child: [
                {
                    title: "Holiday Type",
                    href: "/holiday/holiday-types",
                    icon: UserCircle,
                    permission: "view-holiday-type",
                },
                {
                    title: "Holiday Reason",
                    href: "/holiday/holiday-reasons",
                    icon: UserCircle,
                    permission: "view-holiday-reason",
                },
                // {
                //     title: "Holiday Setup",
                //     href: "/holiday/holiday-setups",
                //     icon: UserCircle,
                //     permission: "view-leave",
                // },
                {
                    title: "Holiday Posting",
                    href: "/holiday/holiday-posting",
                    icon: UserCircle,
                    permission: "view-holiday",
                },
            ],
        },
        {
            title: "Schedule",
            icon: CalendarClock,
            child: [
                {
                    title: "Employee Shift",
                    href: "/schedule/employee-shift",
                    icon: UserCircle,
                    permission: "view-holiday-type",
                },
                {
                    title: "Schedule Setup",
                    href: "/schedule/schedule-setup",
                    icon: UserCircle,
                    permission: "view-holiday-type",
                },
            ],
        },
        {
            title: "Allowance",
            icon: Coins,
            child: [
                {
                    title: "Allowance Type",
                    href: "/allowance/allowance-type",
                    icon: UserCircle,
                    permission: "view-holiday-type",
                },
                {
                    title: "Earning / Deduction",
                    href: "/allowance/earning-deduction",
                    icon: UserCircle,
                    permission: "view-holiday-type",
                },
            ],
        },
        {
            title: "Bonus",
            icon: Gift,
            child: [
                {
                    title: "Bonus Type",
                    href: "/bonus/bonus-type",
                    icon: UserCircle,
                    permission: "view-holiday-type",
                },
            ],
        },
        {
            title: "Punishment",
            icon: Gavel,
            child: [
                {
                    title: "Punishment Type",
                    href: "/punishment/punishment-type",
                    icon: UserCircle,
                    permission: "view-holiday-type",
                },
                {
                    title: "General Punishment",
                    href: "/punishment/punishment-general",
                    icon: UserCircle,
                    permission: "view-holiday-type",
                },
            ],
        },
        {
            title: "Contact Persons",
            icon: UserSquare,
            child: [
                {
                    title: "Client list",
                    href: "/client",
                    icon: UserSquare,
                    permission: "view-client",
                },
            ],
        },
        {
            title: "Inventory",
            icon: Boxes,
            child: [
                {
                    title: "Category",
                    href: "/inventory/tool/category",
                    icon: LayoutGrid,
                    permission: "view-client",
                },
                {
                    title: "Unit",
                    href: "/inventory/tool/unit",
                    icon: Scale,
                    permission: "view-client",
                },
                {
                    title: "Tool List",
                    href: "/inventory/tool/tool-list",
                    icon: Hammer,
                    permission: "view-client",
                },
                {
                    title: "Purchase",
                    href: "/inventory/purchase",
                    icon: ShoppingCart,
                    permission: "view-client",
                },
                {
                    title: "Tool Distribution",
                    href: "/inventory/tool-distribution",
                    icon: ShoppingBasket,
                    permission: "view-client",
                },
                {
                    title: "Tool Damage",
                    href: "/inventory/damage",
                    icon: AlertTriangle,
                    permission: "view-client",
                },
                {
                    title: "Warehouse",
                    href: "/inventory/warehouse",
                    icon: Warehouse,
                    permission: "view-tool-damage",
                },
                {
                    title: "Stock Transfer",
                    href: "/inventory/stock-transfers",
                    icon: Framer,
                    permission: "view-tool-damage",
                },
            ],
        },

        {
            title: "Bank",
            icon: Landmark,
            child: [
                {
                    title: "Bank List",
                    href: "/bank",
                    icon: Building2,
                    permission: "view-client",
                },
            ],
        },

        {
            title: "Finance",
            icon: BadgeDollarSignIcon,
            child: [
                {
                    title: "Payment Type",
                    href: "/finance/payment-type",
                    icon: Type,
                    permission: "view-client",
                },
                {
                    title: "Financial Records",
                    href: "/finance/financial-records",
                    icon: Type,
                    permission: "view-client",
                },
            ],
        },

        {
            title: "Project",
            icon: FolderKanban,
            child: [
                {
                    title: "Project list",
                    href: "/project",
                    icon: ClipboardList,
                    permission: "view-project",
                },
            ],
        },
        {
            title: "Recruitment",
            icon: Briefcase,
            child: [
                {
                    title: "Job list",
                    href: "/recruitment/job-list",
                    icon: ClipboardList,
                    permission: "view-project",
                },
                {
                    title: "Applicant list",
                    href: "/recruitment/applicants",
                    icon: Users,
                    permission: "view-project",
                },
            ],
        },
        {
            title: "Document",
            icon: FileCheck,
            child: [
                {
                    title: "Document Types",
                    href: "/document/document-type",
                    icon: FileCode,
                    permission: "view-document",
                },
                {
                    title: "Documents",
                    href: "/document/documents",
                    icon: FileText,
                    permission: "view-document",
                },
            ],
        },
        {
            title: "Report",
            icon: FileText,
            child: [
                {
                    title: "Employee Report",
                    href: "/report/employee-report",
                    icon: FileCode,
                    permission: "view-employee-reports",
                },
                {
                    title: "Attendance Report",
                    href: "/report/attendance-report",
                    icon: FileCode,
                    permission: "view-attendance-reports",
                },
                {
                    title: "Absent Report",
                    href: "/report/absent-report",
                    icon: FileCode,
                    permission: "view-attendance-reports",
                },
                {
                    title: "Break Report",
                    href: "/report/break-report",
                    icon: FileCode,
                    permission: "view-break-reports",
                },
                {
                    title: "Salary Report",
                    href: "/report/salary-report",
                    icon: FileCode,
                    permission: "view-salary-reports",
                },
                {
                    title: "Pay Slip",
                    href: "/report/pay-slip",
                    icon: FileCode,
                    permission: "view-pay-slip-reports",
                },
                {
                    title: "Inventory Report",
                    href: "/report/inventory-report",
                    icon: FileCode,
                    permission: "view-inventory-reports",
                },
                {
                    title: "Tool Distribution Report",
                    href: "/report/tool-distribution-report",
                    icon: FileCode,
                    permission: "view-tool-distribution-reports",
                },
                {
                    title: "Assigned Employee Report",
                    href: "/report/assigned-employee-report",
                    icon: FileCode,
                    permission: "view-assigned-employee-reports",
                },
                {
                    title: "Finance Report",
                    href: "/report/finance-report",
                    icon: FileCode,
                    permission: "view-financial-reports",
                },
                // {
                //     title: "Finance Report Details",
                //     href: "/report/finance-report-details",
                //     icon: FileCode,
                //     permission: "view-document",
                // },
                {
                    title: "Purchase Summary Report",
                    href: "/report/purchase-report",
                    icon: FileCode,
                    permission: "view-purchase-summary-reports",
                },
                {
                    title: "Purchase Details Report",
                    href: "/report/purchase-details-report",
                    icon: FileCode,
                    permission: "view-purchase-reports",
                },
                {
                    title: "Damage Summary Report",
                    href: "/report/damage-report",
                    icon: FileCode,
                    permission: "view-damage-summary-reports",
                },
                {
                    title: "Damage Details Report",
                    href: "/report/damage-details-report",
                    icon: FileCode,
                    permission: "view-damage-reports",
                },

                {
                    title: "Leave Details Report",
                    href: "/report/leave-details-report",
                    icon: FileCode,
                    permission: "view-damage-reports",
                },
                {
                    title: "Leave Summary Report",
                    href: "/report/leave-summary-report",
                    icon: FileCode,
                    permission: "view-damage-reports",
                },
                {
                    title: "Holiday Details Report",
                    href: "/report/holiday-details-report",
                    icon: FileCode,
                    permission: "view-damage-reports",
                },
            ],
        },
        // {
        //     title: "Client",
        //     icon: UserCog,
        //     isOpen: false,
        //     isHide: false,
        //     child: [
        //         {
        //             title: "Clients List",
        //             href: "/client/clients",
        //             icon: Users,
        //             permission: "view-job-position",
        //         },
        //     ],
        // },
        {
            title: "Settings",
            icon: Settings,
            child: [
                {
                    title: "General Settings",
                    href: "/general-settings",
                    icon: Users,
                    permission: "view-general-setting",
                },
                {
                    title: "Role & Permissions",
                    href: "/role",
                    icon: Users,
                    permission: "view-role-permission",
                },
                {
                    title: "Language",
                    href: "/language",
                    icon: Users,
                    permission: "view-language",
                },
                {
                    title: "Rules",
                    href: "/rule",
                    icon: Users,
                    permission: "view-general-setting",
                },
                {
                    title: "Activity log",
                    href: "/activity",
                    icon: Users,
                    permission: "view-activity-log",
                },
                {
                    title: "Email Template",
                    href: "/email-template",
                    icon: FileText,
                    permission: "view-email-template",
                },
            ],
        },
    ],
    sidebarNav: {
        modern: [
            {
                title: "Dashboard",
                icon: LayoutDashboard,
                child: [
                    {
                        title: "Analytics",
                        href: "/dashboard",
                        icon: BarChart2,
                        permission: "view-dashboard",
                    },
                ],
            },
            {
                title: "Organization",
                icon: Building2,
                child: [
                    {
                        title: "Company list",
                        href: "/company",
                        icon: Building2,
                        permission: "view-company",
                    },
                    {
                        title: "Branch list",
                        href: "/branch",
                        icon: GitBranch,
                        permission: "view-branch",
                    },
                    {
                        title: "Department list",
                        href: "/department",
                        icon: Building,
                        permission: "view-department",
                    },
                    {
                        title: "Job Position list",
                        href: "/job-position",
                        icon: Briefcase,
                        permission: "view-job-position",
                    },
                ],
            },
            {
                title: "Employees",
                icon: Users,
                child: [
                    {
                        title: "Employee Type",
                        href: "/employee-types",
                        icon: UserCircle,
                        permission: "view-employee",
                    },
                    {
                        title: "Employee list",
                        href: "/employees",
                        icon: UserCircle,
                        permission: "view-employee",
                    },
                    {
                        title: "View Attendance",
                        href: "/attendance/view-attendance",
                        icon: UserCircle,
                        permission: "view-qr-attendance",
                    },
                    {
                        title: "Manual Attendance",
                        href: "/attendance/manual-attendance",
                        icon: UserCheck,
                        permission: "manual-attendance",
                    },
                    {
                        title: "Generate QR Code",
                        href: "/generate-qr",
                        icon: QrCode,
                        permission: "generate-qr",
                    },
                    {
                        title: "QR Attendance",
                        href: "/attendance/qr-attendance",
                        icon: ScanLine,
                        permission: "view-attendance",
                    },
                    {
                        title: "Attendance Request",
                        href: "/attendance/attendance-request",
                        icon: UserCheck,
                        permission: "view-attendance-request",
                    },
                    {
                        title: "Salary Generate",
                        href: "/salary/generate",
                        icon: Banknote,
                        permission: "view-salary",
                    },
                    {
                        title: "Overtime",
                        href: "/overtime",
                        icon: Banknote,
                        permission: "manual-attendance",
                    },
                    {
                        title: "Advance",
                        href: "/hrm/advance",
                        icon: Banknote,
                        permission: "manual-attendance",
                    },
                ],
            },
            {
                title: "Break",
                icon: UserCheck,
                child: [
                    {
                        title: "Break Reasons",
                        href: "/attendance/break-reasons",
                        icon: ClipboardList,
                        permission: "view-break-reason",
                    },
                    {
                        title: "Break List",
                        href: "/attendance/break-list",
                        icon: UserCheck,
                        permission: "view-break-list",
                    },
                ],
            },
            {
                title: "Leave",
                icon: CalendarPlus,
                child: [
                    {
                        title: "Leave Type",
                        href: "/leave/leave-types",
                        icon: UserCircle,
                        permission: "view-leave-type",
                    },
                    {
                        title: "Leave Reason",
                        href: "/leave/leave-reasons",
                        icon: UserCircle,
                        permission: "view-leave-reason",
                    },
                    {
                        title: "Leave Application",
                        href: "/leave/leave-application",
                        icon: UserCircle,
                        permission: "view-leave",
                    },
                ],
            },
            {
                title: "Holiday",
                icon: CalendarSearch,
                child: [
                    {
                        title: "Holiday Type",
                        href: "/holiday/holiday-types",
                        icon: UserCircle,
                        permission: "view-holiday-type",
                    },
                    {
                        title: "Holiday Reason",
                        href: "/holiday/holiday-reasons",
                        icon: UserCircle,
                        permission: "view-holiday-reason",
                    },
                    // {
                    //     title: "Holiday Setup",
                    //     href: "/holiday/holiday-setups",
                    //     icon: UserCircle,
                    //     permission: "view-leave",
                    // },
                    {
                        title: "holiday Posting",
                        href: "/holiday/holiday-posting",
                        icon: UserCircle,
                        permission: "view-holiday",
                    },
                ],
            },
            {
                title: "Schedule",
                icon: CalendarClock,
                child: [
                    {
                        title: "Employee Shift",
                        href: "/schedule/employee-shift",
                        icon: UserCircle,
                        permission: "view-holiday-type",
                    },
                    {
                        title: "Schedule Setup",
                        href: "/schedule/schedule-setup",
                        icon: UserCircle,
                        permission: "view-holiday-type",
                    },
                ],
            },
            {
                title: "Allowance",
                icon: Coins,
                child: [
                    {
                        title: "Allowance Type",
                        href: "/allowance/allowance-type",
                        icon: UserCircle,
                        permission: "view-holiday-type",
                    },
                    {
                        title: "Earning / Deduction",
                        href: "/allowance/earning-deduction",
                        icon: UserCircle,
                        permission: "view-holiday-type",
                    },
                ],
            },
            {
                title: "Bonus",
                icon: Gift,
                child: [
                    {
                        title: "Bonus Type",
                        href: "/bonus/bonus-type",
                        icon: UserCircle,
                        permission: "view-holiday-type",
                    },
                ],
            },
            {
                title: "Punishment",
                icon: Gavel,
                child: [
                    {
                        title: "Punishment Type",
                        href: "/punishment/punishment-type",
                        icon: UserCircle,
                        permission: "view-holiday-type",
                    },
                    {
                        title: "General Punishment",
                        href: "/punishment/punishment-general",
                        icon: UserCircle,
                        permission: "view-holiday-type",
                    },
                ],
            },
            {
                title: "Contact Persons",
                icon: UserSquare,
                child: [
                    {
                        title: "Client list",
                        href: "/client",
                        icon: UserSquare,
                        permission: "view-client",
                    },
                ],
            },
            {
                title: "Inventory",
                icon: Boxes,
                child: [
                    {
                        title: "Category",
                        href: "/inventory/tool/category",
                        icon: LayoutGrid,
                        permission: "view-client",
                    },
                    {
                        title: "Unit",
                        href: "/inventory/tool/unit",
                        icon: Scale,
                        permission: "view-client",
                    },
                    {
                        title: "Tool List",
                        href: "/inventory/tool/tool-list",
                        icon: Hammer,
                        permission: "view-client",
                    },
                    {
                        title: "Purchase",
                        href: "/inventory/purchase",
                        icon: ShoppingCart,
                        permission: "view-client",
                    },
                    {
                        title: "Tool Distribution",
                        href: "/inventory/tool-distribution",
                        icon: ShoppingBasket,
                        permission: "view-client",
                    },
                    {
                        title: "Tool Damage",
                        href: "/inventory/damage",
                        icon: AlertTriangle,
                        permission: "view-client",
                    },
                    {
                        title: "Warehouse",
                        href: "/inventory/warehouse",
                        icon: Warehouse,
                        permission: "view-tool-damage",
                    },
                    {
                        title: "Stock Transfer",
                        href: "/inventory/stock-transfers",
                        icon: Framer,
                        permission: "view-tool-damage",
                    },
                ],
            },

            {
                title: "Bank",
                icon: Landmark,
                child: [
                    {
                        title: "Bank List",
                        href: "/bank",
                        icon: Building2,
                        permission: "view-client",
                    },
                ],
            },
            {
                title: "Finance",
                icon: BadgeDollarSignIcon,
                child: [
                    {
                        title: "Payment Type",
                        href: "/finance/payment-type",
                        icon: Type,
                        permission: "view-client",
                    },
                    {
                        title: "Financial Records",
                        href: "/finance/financial-records",
                        icon: Type,
                        permission: "view-client",
                    },
                ],
            },
            {
                title: "Project",
                icon: FolderKanban, // represents projects/boards
                child: [
                    {
                        title: "Project List",
                        href: "/project",
                        icon: ClipboardList, // represents task/project listing
                        permission: "view-project",
                    },
                ],
            },
            {
                title: "Recruitment",
                icon: Briefcase,
                child: [
                    {
                        title: "Job list",
                        href: "/recruitment/job-list",
                        icon: ClipboardList,
                        permission: "view-project",
                    },
                    {
                        title: "Applicant list",
                        href: "/recruitment/applicants",
                        icon: Users,
                        permission: "view-project",
                    },
                ],
            },
            {
                title: "Document",
                icon: FileCheck,
                child: [
                    {
                        title: "Document Types",
                        href: "/document/document-type",
                        icon: FileCode,
                        permission: "view-document",
                    },
                    {
                        title: "Documents",
                        href: "/document/documents",
                        icon: FileText,
                        permission: "view-document",
                    },
                ],
            },
            {
                title: "Report",
                icon: FileText,
                child: [
                    {
                        title: "Employee Report",
                        href: "/report/employee-report",
                        icon: FileCode,
                        permission: "view-employee-reports",
                    },
                    {
                        title: "Attendance Report",
                        href: "/report/attendance-report",
                        icon: FileCode,
                        permission: "view-attendance-reports",
                    },
                    {
                        title: "Absent Report",
                        href: "/report/absent-report",
                        icon: FileCode,
                        permission: "view-attendance-reports",
                    },
                    {
                        title: "Break Report",
                        href: "/report/break-report",
                        icon: FileCode,
                        permission: "view-break-reports",
                    },
                    {
                        title: "Salary Report",
                        href: "/report/salary-report",
                        icon: FileCode,
                        permission: "view-salary-reports",
                    },
                    {
                        title: "Pay Slip",
                        href: "/report/pay-slip",
                        icon: FileCode,
                        permission: "view-pay-slip-reports",
                    },
                    {
                        title: "Inventory Report",
                        href: "/report/inventory-report",
                        icon: FileCode,
                        permission: "view-inventory-reports",
                    },
                    {
                        title: "Tool Distribution Report",
                        href: "/report/tool-distribution-report",
                        icon: FileCode,
                        permission: "view-tool-distribution-reports",
                    },
                    {
                        title: "Assigned Employee Report",
                        href: "/report/assigned-employee-report",
                        icon: FileCode,
                        permission: "view-assigned-employee-reports",
                    },
                    {
                        title: "Finance Report",
                        href: "/report/finance-report",
                        icon: FileCode,
                        permission: "view-financial-reports",
                    },
                    // {
                    //     title: "Finance Report Details",
                    //     href: "/report/finance-report-details",
                    //     icon: FileCode,
                    //     permission: "view-document",
                    // },
                    {
                        title: "Purchase Summary Report",
                        href: "/report/purchase-report",
                        icon: FileCode,
                        permission: "view-purchase-summary-reports",
                    },
                    {
                        title: "Purchase Details Report",
                        href: "/report/purchase-details-report",
                        icon: FileCode,
                        permission: "view-purchase-reports",
                    },
                    {
                        title: "Damage Summary Report",
                        href: "/report/damage-report",
                        icon: FileCode,
                        permission: "view-damage-summary-reports",
                    },
                    {
                        title: "Damage Details Report",
                        href: "/report/damage-details-report",
                        icon: FileCode,
                        permission: "view-damage-reports",
                    },
                    {
                        title: "Leave Details Report",
                        href: "/report/leave-details-report",
                        icon: FileCode,
                        permission: "view-damage-reports",
                    },
                    {
                        title: "Leave Summary Report",
                        href: "/report/leave-summary-report",
                        icon: FileCode,
                        permission: "view-damage-reports",
                    },

                    {
                        title: "Holiday Details Report",
                        href: "/report/holiday-details-report",
                        icon: FileCode,
                        permission: "view-damage-reports",
                    },
                ],
            },

            {
                title: "Settings",
                icon: Settings,
                child: [
                    {
                        title: "General Settings",
                        href: "/general-settings",
                        icon: Users,
                        permission: "view-general-setting",
                    },
                    {
                        title: "Role & Permissions",
                        href: "/role",
                        icon: Users,
                        permission: "view-role-permission",
                    },
                    {
                        title: "Rules",
                        href: "/rule",
                        icon: Users,
                        permission: "view-general-setting",
                    },
                    {
                        title: "Activity log",
                        href: "/activity",
                        icon: Users,
                        permission: "view-activity-log",
                    },
                    {
                        title: "Email Template",
                        href: "/email-template",
                        icon: FileText,
                        permission: "view-email-template",
                    },
                ],
            },
        ],
        classic: [
            {
                isHeader: true,
                title: "menu",
            },
            {
                title: "Dashboard",
                icon: LayoutDashboard,
                href: "/dashboard",
                isOpen: false,
                isHide: false,
                child: [
                    {
                        title: "Analytics",
                        href: "/dashboard",
                        icon: BarChart2,
                        permission: "view-dashboard",
                    },
                ],
            },
            {
                title: "Organization",
                icon: Building2,
                href: "/dashboard",
                isOpen: false,
                isHide: false,
                child: [
                    {
                        title: "Company list",
                        href: "/company",
                        icon: Building2,
                        permission: "view-company",
                    },
                    {
                        title: "Branch list",
                        href: "/branch",
                        icon: GitBranch,
                        permission: "view-branch",
                    },
                    {
                        title: "Department list",
                        href: "/department",
                        icon: Building,
                        permission: "view-department",
                    },
                    {
                        title: "Job Position list",
                        href: "/job-position",
                        icon: Briefcase,
                        permission: "view-job-position",
                    },
                ],
            },
            {
                title: "Employees",
                icon: Users,
                isOpen: false,
                isHide: false,
                child: [
                    {
                        title: "Employee Type",
                        href: "/employee-types",
                        icon: UserCircle,
                        permission: "view-employee",
                    },
                    {
                        title: "Employee list",
                        href: "/employees",
                        icon: UserCircle,
                        permission: "view-employee",
                    },
                    {
                        title: "View Attendance",
                        href: "/attendance/view-attendance",
                        icon: UserCircle,
                        permission: "view-qr-attendance",
                    },
                    {
                        title: "Manual Attendance",
                        href: "/attendance/manual-attendance",
                        icon: UserCheck,
                        permission: "manual-attendance",
                    },
                    {
                        title: "Generate QR Code",
                        href: "/generate-qr",
                        icon: QrCode,
                        permission: "generate-qr",
                    },
                    {
                        title: "QR Attendance",
                        href: "/attendance/qr-attendance",
                        icon: ScanLine,
                        permission: "view-attendance",
                    },
                    {
                        title: "Attendance Request",
                        href: "/attendance/attendance-request",
                        icon: UserCheck,
                        permission: "view-attendance-request",
                    },
                    {
                        title: "Salary Generate",
                        href: "/salary/generate",
                        icon: Banknote,
                        permission: "view-salary",
                    },
                    {
                        title: "Overtime",
                        href: "/overtime",
                        icon: Banknote,
                        permission: "manual-attendance",
                    },
                    {
                        title: "Advance",
                        href: "/hrm/advance",
                        icon: Banknote,
                        permission: "manual-attendance",
                    },
                ],
            },
            {
                title: "Break",
                icon: UserCheck,
                isOpen: false,
                isHide: false,
                child: [
                    {
                        title: "Break Reasons",
                        href: "/attendance/break-reasons",
                        icon: ClipboardList,
                        permission: "view-break-reason",
                    },
                    {
                        title: "Break List",
                        href: "/attendance/break-list",
                        icon: UserCheck,
                        permission: "view-break-list",
                    },
                ],
            },
            {
                title: "Leave",
                icon: CalendarPlus,
                isOpen: false,
                isHide: false,
                child: [
                    {
                        title: "Leave Type",
                        href: "/leave/leave-types",
                        icon: UserCircle,
                        permission: "view-leave-type",
                    },
                    {
                        title: "Leave Reason",
                        href: "/leave/leave-reasons",
                        icon: UserCircle,
                        permission: "view-leave-reason",
                    },
                    {
                        title: "Leave Application",
                        href: "/leave/leave-application",
                        icon: UserCircle,
                        permission: "view-leave",
                    },
                ],
            },
            {
                title: "Holiday",
                icon: CalendarSearch,
                isOpen: false,
                isHide: false,
                child: [
                    {
                        title: "Holiday Type",
                        href: "/holiday/holiday-types",
                        icon: UserCircle,
                        permission: "view-holiday-type",
                    },
                    {
                        title: "Holiday Reason",
                        href: "/holiday/holiday-reasons",
                        icon: UserCircle,
                        permission: "view-holiday-reason",
                    },
                    // {
                    //     title: "Holiday Setup",
                    //     href: "/holiday/holiday-setups",
                    //     icon: UserCircle,
                    //     permission: "view-leave",
                    // },
                    {
                        title: "Holiday Posting",
                        href: "/holiday/holiday-posting",
                        icon: UserCircle,
                        permission: "view-holiday",
                    },
                ],
            },
            {
                title: "Schedule",
                icon: CalendarClock,
                isOpen: false,
                isHide: false,
                child: [
                    {
                        title: "Employee Shift",
                        href: "/schedule/employee-shift",
                        icon: UserCircle,
                        permission: "view-holiday-type",
                    },
                    {
                        title: "Schedule Setup",
                        href: "/schedule/schedule-setup",
                        icon: UserCircle,
                        permission: "view-holiday-type",
                    },
                ],
            },
            {
                title: "Allowance",
                icon: Coins,
                isOpen: false,
                isHide: false,
                child: [
                    {
                        title: "Allowance Type",
                        href: "/allowance/allowance-type",
                        icon: UserCircle,
                        permission: "view-holiday-type",
                    },
                    {
                        title: "Earning / Deduction",
                        href: "/allowance/earning-deduction",
                        icon: UserCircle,
                        permission: "view-holiday-type",
                    },
                ],
            },
            {
                title: "Bonus",
                icon: Gift,
                isOpen: false,
                isHide: false,
                child: [
                    {
                        title: "Bonus Type",
                        href: "/bonus/bonus-type",
                        icon: UserCircle,
                        permission: "view-holiday-type",
                    },
                    {
                        title: "Bonus Setup",
                        href: "/bonus/bonus-setup",
                        icon: UserCircle,
                        permission: "view-holiday-type",
                    },
                    {
                        title: "Bonus Process",
                        href: "/bonus/bonus-process",
                        icon: UserCircle,
                        permission: "view-holiday-type",
                    },
                ],
            },
            {
                title: "Punishment",
                icon: Gavel,
                isOpen: false,
                isHide: false,
                child: [
                    {
                        title: "Punishment Type",
                        href: "/punishment/punishment-type",
                        icon: UserCircle,
                        permission: "view-holiday-type",
                    },
                    {
                        title: "General Punishment",
                        href: "/punishment/punishment-general",
                        icon: UserCircle,
                        permission: "view-holiday-type",
                    },
                ],
            },
            {
                title: "Contact Person",
                icon: UserSquare,
                child: [
                    {
                        title: "Client list",
                        href: "/client",
                        icon: UserSquare,
                        permission: "view-client",
                    },
                ],
            },
            {
                title: "Inventory",
                icon: Boxes,
                child: [
                    {
                        title: "Category",
                        href: "/inventory/tool/category",
                        icon: LayoutGrid,
                        permission: "view-client",
                    },
                    {
                        title: "Unit",
                        href: "/inventory/tool/unit",
                        icon: Scale,
                        permission: "view-client",
                    },
                    {
                        title: "Tool List",
                        href: "/inventory/tool/tool-list",
                        icon: Hammer,
                        permission: "view-client",
                    },
                    {
                        title: "Purchase",
                        href: "/inventory/purchase",
                        icon: ShoppingCart,
                        permission: "view-client",
                    },
                    {
                        title: "Tool Distribution",
                        href: "/inventory/tool-distribution",
                        icon: ShoppingBasket,
                        permission: "view-client",
                    },
                    {
                        title: "Tool Damage",
                        href: "/inventory/damage",
                        icon: AlertTriangle,
                        permission: "view-client",
                    },
                    {
                        title: "Warehouse",
                        href: "/inventory/warehouse",
                        icon: Warehouse,
                        permission: "view-tool-damage",
                    },
                    {
                        title: "Stock Transfer",
                        href: "/inventory/stock-transfers",
                        icon: Framer,
                        permission: "view-tool-damage",
                    },
                ],
            },

            {
                title: "Bank",
                icon: Landmark,
                child: [
                    {
                        title: "Bank List",
                        href: "/bank",
                        icon: Building2,
                        permission: "view-client",
                    },
                ],
            },

            {
                title: "Finance",
                icon: BadgeDollarSignIcon,
                child: [
                    {
                        title: "Payment Type",
                        href: "/finance/payment-type",
                        icon: Type,
                        permission: "view-client",
                    },
                    {
                        title: "Financial Records",
                        href: "/finance/financial-records",
                        icon: Type,
                        permission: "view-client",
                    },
                ],
            },

            {
                title: "Project",
                icon: FolderKanban,
                child: [
                    {
                        title: "Project list",
                        href: "/project",
                        icon: ClipboardList,
                        permission: "view-project",
                    },
                ],
            },
            {
                title: "Recruitment",
                icon: Briefcase,
                child: [
                    {
                        title: "Job list",
                        href: "/recruitment/job-list",
                        icon: ClipboardList,
                        permission: "view-project",
                    },
                    {
                        title: "Applicant list",
                        href: "/recruitment/applicants",
                        icon: Users,
                        permission: "view-project",
                    },
                ],
            },
            {
                title: "Document",
                icon: FileCheck,
                isOpen: false,
                isHide: false,
                child: [
                    {
                        title: "Document Types",
                        href: "/document/document-type",
                        icon: FileCode,
                        permission: "view-document",
                    },
                    {
                        title: "Documents",
                        href: "/document/documents",
                        icon: FileText,
                        permission: "view-document",
                    },
                ],
            },
            {
                title: "Report",
                icon: FileText,
                isOpen: false,
                isHide: false,
                child: [
                    {
                        title: "Employee Report",
                        href: "/report/employee-report",
                        icon: FileCode,
                        permission: "view-employee-reports",
                    },
                    {
                        title: "Attendance Report",
                        href: "/report/attendance-report",
                        icon: FileCode,
                        permission: "view-attendance-reports",
                    },
                    {
                        title: "Absent Report",
                        href: "/report/absent-report",
                        icon: FileCode,
                        permission: "view-attendance-reports",
                    },
                    {
                        title: "Break Report",
                        href: "/report/break-report",
                        icon: FileCode,
                        permission: "view-break-reports",
                    },
                    {
                        title: "Salary Report",
                        href: "/report/salary-report",
                        icon: FileCode,
                        permission: "view-salary-reports",
                    },
                    {
                        title: "Pay Slip",
                        href: "/report/pay-slip",
                        icon: FileCode,
                        permission: "view-pay-slip-reports",
                    },
                    {
                        title: "Inventory Report",
                        href: "/report/inventory-report",
                        icon: FileCode,
                        permission: "view-inventory-reports",
                    },
                    {
                        title: "Tool Distribution Report",
                        href: "/report/tool-distribution-report",
                        icon: FileCode,
                        permission: "view-tool-distribution-reports",
                    },
                    {
                        title: "Assigned Employee Report",
                        href: "/report/assigned-employee-report",
                        icon: FileCode,
                        permission: "view-assigned-employee-reports",
                    },
                    {
                        title: "Finance Report",
                        href: "/report/finance-report",
                        icon: FileCode,
                        permission: "view-financial-reports",
                    },
                    // {
                    //     title: "Finance Report Details",
                    //     href: "/report/finance-report-details",
                    //     icon: FileCode,
                    //     permission: "view-document",
                    // },
                    {
                        title: "Purchase Summary Report",
                        href: "/report/purchase-report",
                        icon: FileCode,
                        permission: "view-purchase-summary-reports",
                    },
                    {
                        title: "Purchase Details Report",
                        href: "/report/purchase-details-report",
                        icon: FileCode,
                        permission: "view-purchase-reports",
                    },
                    {
                        title: "Damage Summary Report",
                        href: "/report/damage-report",
                        icon: FileCode,
                        permission: "view-damage-summary-reports",
                    },
                    {
                        title: "Damage Details Report",
                        href: "/report/damage-details-report",
                        icon: FileCode,
                        permission: "view-damage-reports",
                    },

                    {
                        title: "Leave Details Report",
                        href: "/report/leave-details-report",
                        icon: FileCode,
                        permission: "view-damage-reports",
                    },
                    {
                        title: "Leave Summary Report",
                        href: "/report/leave-summary-report",
                        icon: FileCode,
                        permission: "view-damage-reports",
                    },
                    {
                        title: "Holiday Details Report",
                        href: "/report/holiday-details-report",
                        icon: FileCode,
                        permission: "view-damage-reports",
                    },
                ],
            },

            {
                title: "Settings",
                icon: Settings,
                href: "#",
                child: [
                    {
                        title: "General Settings",
                        href: "/general-settings",
                        icon: Users,
                        permission: "view-general-setting",
                    },
                    {
                        title: "Role & Permissions",
                        href: "/role",
                        icon: Users,
                        permission: "view-role-permission",
                    },
                    {
                        title: "Language",
                        href: "/language",
                        icon: Users,
                        permission: "view-language",
                    },
                    {
                        title: "Rules",
                        href: "/rule",
                        icon: Users,
                        permission: "view-general-setting",
                    },
                    {
                        title: "Activity log",
                        href: "/activity",
                        icon: Users,
                        permission: "view-activity-log",
                    },
                    {
                        title: "Email Template",
                        href: "/email-template",
                        icon: FileText,
                        permission: "view-email-template",
                    },
                ],
            },
        ],
    },
};
