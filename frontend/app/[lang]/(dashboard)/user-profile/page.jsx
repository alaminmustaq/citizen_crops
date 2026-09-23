"use client";

import UserInfo from './overview/user-info';
import Skills from './overview/skills'; 
import About from './overview/about';
import { useProfile } from "@/domains/profile/hook/useProfile";
import { useAppSelector } from '@/hooks/use-redux';

const Overview = () => {
  const { isFetching } = useProfile();
  const {profile}=useAppSelector((state)=> state.profileData);

  if (isFetching) return <p>Loading profile...</p>;
  if (!profile) return <p>No profile data found.</p>;

  return (
    <div className="pt-6 grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <UserInfo />
        {/* <Skills /> */}
      </div>
      <div className="col-span-12 lg:col-span-8 space-y-6">
        <About />
        {/* <RecentActivity /> */}
        {/* <Projects /> */}
      </div>
    </div>
  );
};

export default Overview;
