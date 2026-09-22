"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDashboardData, setUsersData,setJobPositionData} from "@/domains/dashboard/model/dashboardSlice"; 
import { useDashboardFetchQuery } from "@/domains/dashboard/services/dashboardApi"; 
import toast from "react-hot-toast";

export const useDashboard = () => {
  const dispatch = useDispatch(); 

  // Fetch data from backend using RTK Query
  const { data, isSuccess } = useDashboardFetchQuery("");

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setDashboardData(data));
    }
  }, [isSuccess, data, dispatch]);

  return {
    data
  };
};
