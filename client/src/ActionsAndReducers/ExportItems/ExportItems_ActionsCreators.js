export const CREATE_EXPORT_ITEM = 'CREATE_EXPORT_ITEM';

export const createExportItem = (exportData) => ({
  type: CREATE_EXPORT_ITEM,
  payload: { exportData: exportData }
});
