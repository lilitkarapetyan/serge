import ActionConstant from '../ActionConstants.js';

export const modalAction = {
  open: () => ({
    type: ActionConstant.OPEN_MODAL,
    payload: {
      open: true,
    },
  }),

  close: () => ({
    type: ActionConstant.CLOSE_MODAL,
    payload: {
      open: false,
    },
  })
};