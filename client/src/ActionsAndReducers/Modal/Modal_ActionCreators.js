import ActionConstant from '../ActionConstants.js';

export const modalAction = {
  open: (openModal) => ({
    type: ActionConstant.OPEN_MODAL,
    payload: {
      open: true,
      modal: openModal,
    },
  }),

  close: () => ({
    type: ActionConstant.CLOSE_MODAL,
    payload: {
      open: false,
      modal: '',
    },
  })
};
