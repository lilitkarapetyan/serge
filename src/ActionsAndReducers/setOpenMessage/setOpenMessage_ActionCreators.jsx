import ActionConstant from '../ActionConstants';

export const setOpenMessage = (id) => ({
  type: ActionConstant.CURRENT_OPEN_MESSAGE,
  payload: id
});