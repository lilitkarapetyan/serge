import ActionConstant from '../ActionConstants';

export const exportItems = (state = [], action) => {
  switch (action.type) {
    case ActionConstant.CREATE_EXPORT_ITEM:
      return [...state, action.payload.exportData];
    default:
      return state;
  }
};
