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
    Landmark,
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
                    permission: "view-statistics",
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
                    title: "Employee list",
                    href: "/employees",
                    icon: UserCircle,
                    permission: "view-employee",
                },
                {
                    title: "View Attendance",
                    href: "/attendance/view-attendance",
                    icon: UserCircle,
                    permission: "view-attendance",
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
                    title: "Salary Generate",
                    href: "/salary/generate",
                    icon: Banknote,
                    permission: "view-salary",
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
                    title: "Role & Permissions",
                    href: "/role",
                    icon: Users,
                    permission: "manage-settings",
                },
                {
                    title: "Language",
                    href: "/language",
                    icon: Users,
                    permission: "view-language",
                },
                {
                    title: "Activity log",
                    href: "/activity",
                    icon: Users,
                    permission: "view-activity-log",
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
                        permission: "view-statistics",
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
                        title: "Employee list",
                        href: "/employees",
                        icon: UserCircle,
                        permission: "view-employee",
                    },
                    {
                        title: "View Attendance",
                        href: "/attendance/view-attendance",
                        icon: UserCircle,
                        permission: "view-attendance",
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
                        title: "Salary Generate",
                        href: "/salary/generate",
                        icon: Banknote,
                        permission: "view-salary",
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
                title: "Settings",
                icon: Settings,
                child: [
                    {
                        title: "Role & Permissions",
                        href: "/role",
                        icon: Users,
                        permission: "manage-settings",
                    },
                    {
                        title: "Activity log",
                        href: "/activity",
                        icon: Users,
                        permission: "view-activity-log",
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
                        permission: "view-statistics",
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
                        title: "Employee list",
                        href: "/employees",
                        icon: UserCircle,
                        permission: "view-employee",
                    },
                    {
                        title: "View Attendance",
                        href: "/attendance/view-attendance",
                        icon: UserCircle,
                        permission: "view-attendance",
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
                        title: "Salary Generate",
                        href: "/salary/generate",
                        icon: Banknote,
                        permission: "view-salary",
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
                title: "Settings",
                icon: Settings,
                href: "#",
                child: [
                    {
                        title: "Role & Permissions",
                        href: "/role",
                        icon: Users,
                        permission: "manage-settings",
                    },
                    {
                        title: "Language",
                        href: "/language",
                        icon: Users,
                        permission: "view-language",
                    },
                    {
                        title: "Activity log",
                        href: "/activity",
                        icon: Users,
                        permission: "view-activity-log",
                    },
                ],
            },
        ],
    },
};
