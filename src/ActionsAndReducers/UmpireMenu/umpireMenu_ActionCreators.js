import ActionConstant from '../ActionConstants';

export const setSelectedSchema = (schema) => ({
  type: ActionConstant.SET_SELECTED_SCHEMA,
  payload: schema
});

export const setOpenMessage = (id) => ({
  type: ActionConstant.CURRENT_OPEN_MESSAGE_TYPE,
  payload: id
});