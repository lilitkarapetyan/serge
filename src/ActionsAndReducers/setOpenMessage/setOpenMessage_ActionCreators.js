import ActionConstant from '../ActionConstants';

export const setOpenMessage = (id) => ({
  type: ActionConstant.CURRENT_OPEN_MESSAGE_TYPE,
  payload: id
});