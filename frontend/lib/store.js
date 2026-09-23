import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/domains/auth/model/authSlice";
import { authApi } from "@/domains/auth/services/authApi";
import { companyApi } from "@/domains/company/services/companyApi";
import { roleApi } from "@/domains/role-and-permission/role/services/roleApi";
import { branchApi } from "@/domains/branch/services/branchApi";
import { departmentApi } from "@/domains/department/services/departmentApi";
import { jobPositionApi } from "@/domains/job-position/services/jobPositionApi";
import { dynamicSelectApi } from "@/domains/dynamic-select/services/dynamicSelectApi";
import { employApi } from "@/domains/employ/services/employApi";
import { salaryApi } from "@/domains/salary/services/salaryApi";
import employReducer from "@/domains/employ/model/employSlice";
import projectReducer from "@/domains/project/model/projectSlice";
import dashboardReducer from "@/domains/dashboard/model/dashboardSlice";
import { attendanceApi } from "@/domains/attendance/services/attendanceApi";
import attendanceReducer from "@/domains/attendance/model/attendanceSlice";
import { documentTypeApi } from "@/domains/document/services/documentTypeApi";
import { projectApi } from "@/domains/project/services/projectApi";
import { documentApi } from "@/domains/document/services/documentApi";
import { profileApi } from "@/domains/profile/services/profileApi";
import { clientApi } from "@/domains/client/services/clientApi";
import profileReducer from "@/domains/profile/model/profileSlice";
import { manualAttendanceApi } from "@/domains/manual-attendance/services/manualAttendanceApi";
import { categoryApi } from "@/domains/inventory/tool/category/services/categoryApi";
import { unitApi } from "@/domains/inventory/tool/unit/services/unitApi";
import { toolApi } from "@/domains/inventory/tool/tool-list/services/toolApi";
import { purchaseApi } from "@/domains/inventory/purchase/services/purchaseApi";
import { toolDistributionApi } from "@/domains/inventory/tool-distribution/services/toolDistributionApi";
import { damageApi } from "@/domains/inventory/damage/services/damageApi";
import { warehouseApi } from "@/domains/inventory/warehouse/services/warehouseApi";
import { stockTransferApi } from "@/domains/inventory/stock-transfer/services/stockTransferApi";
import { recPaymentTypeApi } from "@/domains/rec-payment-type/services/recPaymentTypeApi";
import { financialRecordsApi } from "@/domains/finance/services/financialRecordsApi";
import { bankApi } from "@/domains/bank/services/bankApi";
import { dashboardApi } from "@/domains/dashboard/services/dashboardApi";
import { languageApi } from "@/domains/language/services/languageApi";
import { activityApi } from "@/domains/activity/services/activityApi";
import { notificationApi } from "@/domains/notification/services/notificationApi";

const store = configureStore({
    reducer: {
        auth: authReducer,
        employ: employReducer,
        attendance: attendanceReducer,
        profileData: profileReducer,
        project: projectReducer, 
        dashboard: dashboardReducer, 

        [authApi.reducerPath]: authApi.reducer,
        [companyApi.reducerPath]: companyApi.reducer,
        [roleApi.reducerPath]: roleApi.reducer,
        [branchApi.reducerPath]: branchApi.reducer,
        [departmentApi.reducerPath]: departmentApi.reducer,
        [jobPositionApi.reducerPath]: jobPositionApi.reducer,
        [dynamicSelectApi.reducerPath]: dynamicSelectApi.reducer,
        [employApi.reducerPath]: employApi.reducer,
        [salaryApi.reducerPath]: salaryApi.reducer,
        [attendanceApi.reducerPath]: attendanceApi.reducer, // keep only once
        [documentTypeApi.reducerPath]: documentTypeApi.reducer,
        [documentApi.reducerPath]: documentApi.reducer,
        [projectApi.reducerPath]: projectApi.reducer,
        [manualAttendanceApi.reducerPath]: manualAttendanceApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
        [clientApi.reducerPath]: clientApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [unitApi.reducerPath]: unitApi.reducer,
        [toolApi.reducerPath]: toolApi.reducer,
        [purchaseApi.reducerPath]: purchaseApi.reducer,
        [toolDistributionApi.reducerPath]: toolDistributionApi.reducer,
        [damageApi.reducerPath]: damageApi.reducer,
        [warehouseApi.reducerPath]: warehouseApi.reducer,
        [stockTransferApi.reducerPath]: stockTransferApi.reducer,
        [recPaymentTypeApi.reducerPath]: recPaymentTypeApi.reducer,
        [financialRecordsApi.reducerPath]: financialRecordsApi.reducer,
        [bankApi.reducerPath]: bankApi.reducer,
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [languageApi.reducerPath]: languageApi.reducer,
        [activityApi.reducerPath]: activityApi.reducer,
        [notificationApi.reducerPath]: notificationApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(companyApi.middleware)
            .concat(roleApi.middleware)
            .concat(departmentApi.middleware)
            .concat(projectApi.middleware)
            .concat(jobPositionApi.middleware)
            .concat(dynamicSelectApi.middleware)
            .concat(employApi.middleware)
            .concat(branchApi.middleware)
            .concat(salaryApi.middleware)
            .concat(attendanceApi.middleware) // keep only once
            .concat(manualAttendanceApi.middleware)
            .concat(documentTypeApi.middleware)
            .concat(documentApi.middleware)
            .concat(clientApi.middleware) // keep only once
            .concat(profileApi.middleware)
            .concat(categoryApi.middleware)
            .concat(unitApi.middleware)
            .concat(toolApi.middleware)
            .concat(toolDistributionApi.middleware)
            .concat(damageApi.middleware)
            .concat(purchaseApi.middleware)
            .concat(warehouseApi.middleware)
            .concat(stockTransferApi.middleware)
            .concat(recPaymentTypeApi.middleware)
            .concat(financialRecordsApi.middleware)
            .concat(bankApi.middleware)
            .concat(dashboardApi.middleware)
            .concat(languageApi.middleware)
            .concat(activityApi.middleware)
            .concat(notificationApi.middleware)
});

export default store;