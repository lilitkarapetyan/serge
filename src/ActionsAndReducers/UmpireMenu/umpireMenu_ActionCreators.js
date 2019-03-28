import ActionConstant from '../ActionConstants';

export const setSelectedSchema = (schema) => ({
  type: ActionConstant.SET_SELECTED_SCHEMA,
  payload: schema
});