import DashboardPageView from "./page-view";
import { getDictionary } from "@/app/dictionaries";


const Dashboard = async ({ params }) => {
    const { lang } = await params;

    const trans = [];
    return <DashboardPageView trans={trans} />;
};

export default Dashboard;
