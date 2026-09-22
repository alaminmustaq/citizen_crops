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
import projectReducer from "@/domains/project/model/projectSlice";
import employReducer from "@/domains/employ/model/employSlice";
import documentReducer from "@/domains/document/model/documentSlice";
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
import { allNotificationApi } from "@/domains/all-notification/services/allNotificationApi";
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
import { generalSettingApi } from "@/domains/settings/services/generalSettingApi";
import { ruleApi} from "@/domains/rule/services/ruleApi";
import { reportApi} from "@/domains/report/services/reportApi";
import { leaveTypesApi} from "@/domains/leave/leave-types/services/leaveTypesApi";
import { leaveReasonApi} from "@/domains/leave/leave-reasons/services/leaveReasonApi";
import { leaveApplicationApi} from "@/domains/leave/leave-application/services/leaveApplicationApi";
import { groupFormPaginatedApi } from "@/domains/group-form-paginated/services/groupFormPaginatedApi";
import { holidayTypesApi} from "@/domains/holiday/holiday-types/services/holidayTypesApi";
import { holidayReasonApi} from "@/domains/holiday/holiday-reasons/services/holidayReasonApi";
import { holidaySetupApi} from "@/domains/holiday/holiday-setup/services/holidaySetupApi";
import { holidayPostingApi} from "@/domains/holiday/holiday-posting/services/holidayPostingApi";
import { scheduleSetupApi} from "@/domains/schedule/schedule-setup/services/scheduleSetupApi";
import { employeeTypesApi } from "@/domains/employee-types/services/employeeTypesApi";
import { employeeShiftApi } from "@/domains/schedule/employee-shift/services/employeeShiftApi";
import { allowanceTypesApi } from "@/domains/allowance/allowance-types/services/allowanceTypesApi";
import { earningDeductionApi } from "@/domains/allowance/earning-deduction/services/earningDeductionApi";
import { punishmentTypesApi} from "@/domains/punishment/punishment-types/services/punishmentTypesApi";
import { punishmentGeneralApi} from "@/domains/punishment/punishment-general/services/punishmentGeneralApi";
import { overtimeApi } from "@/domains/Overtime/services/overtimeApi";
import { advanceApi } from "@/domains/Advance/services/advanceApi";
import { bonusTypesApi } from "@/domains/bonus/bonus-types/services/bonusTypesApi";
import { bonusSetupApi } from "@/domains/bonus/bonus-setup/services/bonusSetupApi";
import { bonusProcessApi } from "@/domains/bonus/bonus-process/services/bonusProcessApi";
import { jobListApi } from "@/domains/recruitment/job-list/services/jobListApi";
import { emailTemplateApi } from "@/domains/email-template/services/emailTemplateApi";
import { applicantsApi } from "@/domains/recruitment/applicants/services/applicantsApi";
import { breakReasonApi } from "@/domains/attendance/break-reasons/services/breakReasonApi";
import { featureSettingApi } from "@/domains/settings/services/featureSettingApi";

const store = configureStore({
    reducer: {
        auth: authReducer,
        employ: employReducer,
        document: documentReducer,
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
        [allNotificationApi.reducerPath]: allNotificationApi.reducer,
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
        [generalSettingApi.reducerPath]: generalSettingApi.reducer,
        [ruleApi.reducerPath]: ruleApi.reducer,
        [reportApi.reducerPath]: reportApi.reducer,
        [leaveTypesApi.reducerPath]: leaveTypesApi.reducer,
        [leaveReasonApi.reducerPath]: leaveReasonApi.reducer,
        [leaveApplicationApi.reducerPath]: leaveApplicationApi.reducer,
        [groupFormPaginatedApi.reducerPath]: groupFormPaginatedApi.reducer,
        [holidayTypesApi.reducerPath]: holidayTypesApi.reducer,
        [holidayReasonApi.reducerPath]: holidayReasonApi.reducer,
        [holidaySetupApi.reducerPath]: holidaySetupApi.reducer,
        [holidayPostingApi.reducerPath]: holidayPostingApi.reducer,
        [scheduleSetupApi.reducerPath]: scheduleSetupApi.reducer,
        [employeeTypesApi.reducerPath]: employeeTypesApi.reducer,
        [employeeShiftApi.reducerPath]: employeeShiftApi.reducer,
        [allowanceTypesApi.reducerPath]: allowanceTypesApi.reducer,
        [earningDeductionApi.reducerPath]: earningDeductionApi.reducer,
        [punishmentTypesApi.reducerPath]: punishmentTypesApi.reducer,
        [punishmentGeneralApi.reducerPath]: punishmentGeneralApi.reducer,
        [overtimeApi.reducerPath]: overtimeApi.reducer,
        [advanceApi.reducerPath]: advanceApi.reducer,
        [bonusTypesApi.reducerPath]: bonusTypesApi.reducer,
        [bonusSetupApi.reducerPath]: bonusSetupApi.reducer,
        [bonusProcessApi.reducerPath]: bonusProcessApi.reducer,
        [jobListApi.reducerPath]: jobListApi.reducer,
        [emailTemplateApi.reducerPath]: emailTemplateApi.reducer,
        [applicantsApi.reducerPath]: applicantsApi.reducer,
        [breakReasonApi.reducerPath]: breakReasonApi.reducer,
        [featureSettingApi.reducerPath]: featureSettingApi.reducer,
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
            .concat(allNotificationApi.middleware)
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
            .concat(generalSettingApi.middleware)
            .concat(ruleApi.middleware)
            .concat(reportApi.middleware)
            .concat(leaveTypesApi.middleware)
            .concat(leaveReasonApi.middleware)
            .concat(leaveApplicationApi.middleware)
            .concat(groupFormPaginatedApi.middleware)
            .concat(holidayTypesApi.middleware)
            .concat(holidayReasonApi.middleware)
            .concat(holidaySetupApi.middleware)
            .concat(holidayPostingApi.middleware)
            .concat(scheduleSetupApi.middleware)
            .concat(employeeTypesApi.middleware)
            .concat(employeeShiftApi.middleware)
            .concat(allowanceTypesApi.middleware)
            .concat(earningDeductionApi.middleware)
            .concat(punishmentTypesApi.middleware)
            .concat(punishmentGeneralApi.middleware)
            .concat(overtimeApi.middleware)
            .concat(advanceApi.middleware)
            .concat(bonusTypesApi.middleware)
            .concat(bonusSetupApi.middleware)
            .concat(bonusProcessApi.middleware)
            .concat(jobListApi.middleware)
            .concat(emailTemplateApi.middleware)
            .concat(applicantsApi.middleware)
            .concat(breakReasonApi.middleware)
            .concat(featureSettingApi.middleware)
});

export default store;
