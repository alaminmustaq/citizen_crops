"use client";
import { useDispatch, useSelector } from "react-redux";
import { setDashboardData, setUsersData,setJobPositionData} from "@/domains/dashboard/model/dashboardSlice"; 
import { useDashboardFetchQuery } from "@/domains/dashboard/services/dashboardApi"; 
import toast from "react-hot-toast";

export const useDashboard = () => {
  const dispatch = useDispatch(); 

  // Fetch data from backend using RTK Query or axios
  const { data, isSuccess, isError, error } = useDashboardFetchQuery("", {
    selectFromResult: (result) => {
      if (result?.data) {
 
            dispatch(setDashboardData(result?.data)); 
        } 
        return result; 
    },
});


  return {
   data
  };
};
