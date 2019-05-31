import { CREATE_EXPORT_ITEM } from './ExportItems_ActionsCreators';

export const exportItems = (state = [], action) => {
  switch (action.type) {
    case CREATE_EXPORT_ITEM:
      return [...state, action.payload.exportData];
    default:
      return state;
  }
};
