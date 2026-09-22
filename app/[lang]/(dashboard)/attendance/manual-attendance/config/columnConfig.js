/**
 * Column Configuration Helper for Manual Attendance
 * Provides flexible column management based on data structure
 */

// Column field definitions based on tableData structure
export const COLUMN_FIELDS = {
  // Master attendance fields
  ID: 'id',
  MASTER_ATTENDANCE_ID: 'masterAttendanceId',
  ATTENDANCE_TYPE: 'attendanceType',
  GLOBAL_DATE: 'globalDate',
  GLOBAL_CHECK_IN_TIME: 'globalCheckInTime',
  GLOBAL_CHECK_OUT_TIME: 'globalCheckOutTime',
  NOTES: 'notes',
  STATUS: 'status',
  
  // Display fields (formatted for UI)
  DISPLAY_DATE: 'displayDate',
  DISPLAY_TIME_RANGE: 'displayTimeRange',
  DISPLAY_PROJECT: 'displayProject',
  DISPLAY_EMPLOYEE_COUNT: 'displayEmployeeCount',
  DISPLAY_PRESENT_COUNT: 'displayPresentCount',
  DISPLAY_TOTAL_HOURS: 'displayTotalHours',
  DISPLAY_CREATOR: 'displayCreator',
  DISPLAY_STATUS: 'displayStatus',
  
  // Nested object fields
  PROJECT: 'project',
  CREATOR: 'creator',
  STATISTICS: 'statistics',
  EMPLOYEE_ATTENDANCES: 'employeeAttendances',
  
  // Permission fields
  CAN_EDIT: 'canEdit',
  CAN_DELETE: 'canDelete',
};

// Column types for filtering and sorting
export const COLUMN_TYPES = {
  TEXT: 'text',
  DATE: 'date',
  TIME: 'time',
  NUMBER: 'number',
  STATUS: 'status',
  BADGE: 'badge',
  OBJECT: 'object',
  ARRAY: 'array',
  BOOLEAN: 'boolean',
  ACTIONS: 'actions',
};

// Predefined column configurations
export const COLUMN_CONFIGS = {
  // Basic columns for minimal view
  MINIMAL: [
    COLUMN_FIELDS.DISPLAY_DATE,
    COLUMN_FIELDS.ATTENDANCE_TYPE,
    COLUMN_FIELDS.DISPLAY_PROJECT,
    COLUMN_FIELDS.STATUS,
    'actions'
  ],
  
  // Standard columns for normal view
  STANDARD: [
    COLUMN_FIELDS.DISPLAY_DATE,
    COLUMN_FIELDS.ATTENDANCE_TYPE,
    COLUMN_FIELDS.DISPLAY_PROJECT,
    COLUMN_FIELDS.DISPLAY_TIME_RANGE,
    COLUMN_FIELDS.STATISTICS,
    COLUMN_FIELDS.STATUS,
    'actions'
  ],
  
  // Detailed columns for comprehensive view
  DETAILED: [
    COLUMN_FIELDS.DISPLAY_DATE,
    COLUMN_FIELDS.ATTENDANCE_TYPE,
    COLUMN_FIELDS.DISPLAY_PROJECT,
    COLUMN_FIELDS.DISPLAY_TIME_RANGE,
    COLUMN_FIELDS.STATISTICS,
    COLUMN_FIELDS.DISPLAY_TOTAL_HOURS,
    COLUMN_FIELDS.DISPLAY_CREATOR,
    COLUMN_FIELDS.STATUS,
    'actions'
  ],
  
  // Analytics focused columns
  ANALYTICS: [
    COLUMN_FIELDS.DISPLAY_DATE,
    COLUMN_FIELDS.ATTENDANCE_TYPE,
    COLUMN_FIELDS.STATISTICS,
    COLUMN_FIELDS.DISPLAY_TOTAL_HOURS,
    COLUMN_FIELDS.STATUS,
  ],
};

// Column metadata for dynamic column generation
export const COLUMN_METADATA = {
  [COLUMN_FIELDS.DISPLAY_DATE]: {
    type: COLUMN_TYPES.DATE,
    label: 'Date',
    sortable: true,
    filterable: true,
    width: 120,
    priority: 1,
  },
  [COLUMN_FIELDS.ATTENDANCE_TYPE]: {
    type: COLUMN_TYPES.BADGE,
    label: 'Type',
    sortable: true,
    filterable: true,
    width: 100,
    priority: 2,
  },
  [COLUMN_FIELDS.DISPLAY_PROJECT]: {
    type: COLUMN_TYPES.TEXT,
    label: 'Project',
    sortable: true,
    filterable: true,
    width: 150,
    priority: 3,
  },
  [COLUMN_FIELDS.DISPLAY_TIME_RANGE]: {
    type: COLUMN_TYPES.TIME,
    label: 'Time Range',
    sortable: false,
    filterable: false,
    width: 120,
    priority: 4,
  },
  [COLUMN_FIELDS.STATISTICS]: {
    type: COLUMN_TYPES.OBJECT,
    label: 'Employees',
    sortable: true,
    filterable: false,
    width: 150,
    priority: 5,
  },
  [COLUMN_FIELDS.DISPLAY_TOTAL_HOURS]: {
    type: COLUMN_TYPES.NUMBER,
    label: 'Total Hours',
    sortable: true,
    filterable: false,
    width: 100,
    priority: 6,
  },
  [COLUMN_FIELDS.DISPLAY_CREATOR]: {
    type: COLUMN_TYPES.TEXT,
    label: 'Created By',
    sortable: true,
    filterable: true,
    width: 120,
    priority: 7,
  },
  [COLUMN_FIELDS.STATUS]: {
    type: COLUMN_TYPES.STATUS,
    label: 'Status',
    sortable: true,
    filterable: true,
    width: 100,
    priority: 8,
  },
  [COLUMN_FIELDS.NOTES]: {
    type: COLUMN_TYPES.TEXT,
    label: 'Notes',
    sortable: false,
    filterable: true,
    width: 200,
    priority: 9,
  },
  actions: {
    type: COLUMN_TYPES.ACTIONS,
    label: 'Actions',
    sortable: false,
    filterable: false,
    width: 100,
    priority: 10,
  },
};

// Filter options for different column types
export const FILTER_OPTIONS = {
  [COLUMN_FIELDS.ATTENDANCE_TYPE]: [
    { value: 'company_attendance', label: 'Company Attendance' },
    { value: 'project_attendance', label: 'Project Attendance' },
  ],
  [COLUMN_FIELDS.STATUS]: [
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' },
  ],
};

// Responsive column configurations
export const RESPONSIVE_CONFIGS = {
  mobile: {
    visibleColumns: [
      COLUMN_FIELDS.DISPLAY_DATE,
      COLUMN_FIELDS.ATTENDANCE_TYPE,
      COLUMN_FIELDS.STATUS,
      'actions'
    ],
    maxColumns: 4,
  },
  tablet: {
    visibleColumns: [
      COLUMN_FIELDS.DISPLAY_DATE,
      COLUMN_FIELDS.ATTENDANCE_TYPE,
      COLUMN_FIELDS.DISPLAY_PROJECT,
      COLUMN_FIELDS.STATISTICS,
      COLUMN_FIELDS.STATUS,
      'actions'
    ],
    maxColumns: 6,
  },
  desktop: {
    visibleColumns: COLUMN_CONFIGS.STANDARD,
    maxColumns: 10,
  },
};

/**
 * Get column configuration based on view type
 * @param {string} viewType - The type of view (minimal, standard, detailed, analytics)
 * @returns {Array} Array of column field names
 */
export const getColumnConfig = (viewType = 'standard') => {
  return COLUMN_CONFIGS[viewType.toUpperCase()] || COLUMN_CONFIGS.STANDARD;
};

/**
 * Get column metadata for a specific field
 * @param {string} field - The column field name
 * @returns {Object} Column metadata object
 */
export const getColumnMetadata = (field) => {
  return COLUMN_METADATA[field] || {};
};

/**
 * Get responsive column configuration
 * @param {string} breakpoint - The responsive breakpoint (mobile, tablet, desktop)
 * @returns {Object} Responsive configuration object
 */
export const getResponsiveConfig = (breakpoint = 'desktop') => {
  return RESPONSIVE_CONFIGS[breakpoint] || RESPONSIVE_CONFIGS.desktop;
};

/**
 * Generate column visibility settings
 * @param {Array} visibleColumns - Array of column field names to show
 * @returns {Object} Column visibility object for table
 */
export const generateColumnVisibility = (visibleColumns) => {
  const visibility = {};
  
  Object.keys(COLUMN_METADATA).forEach(field => {
    visibility[field] = visibleColumns.includes(field);
  });
  
  return visibility;
};

/**
 * Sort columns by priority
 * @param {Array} columns - Array of column field names
 * @returns {Array} Sorted array of column field names
 */
export const sortColumnsByPriority = (columns) => {
  return columns.sort((a, b) => {
    const priorityA = getColumnMetadata(a).priority || 999;
    const priorityB = getColumnMetadata(b).priority || 999;
    return priorityA - priorityB;
  });
};

// Export default configuration
export default {
  COLUMN_FIELDS,
  COLUMN_TYPES,
  COLUMN_CONFIGS,
  COLUMN_METADATA,
  FILTER_OPTIONS,
  RESPONSIVE_CONFIGS,
  getColumnConfig,
  getColumnMetadata,
  getResponsiveConfig,
  generateColumnVisibility,
  sortColumnsByPriority,
};