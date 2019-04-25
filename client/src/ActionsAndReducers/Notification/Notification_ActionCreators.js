import ActionConstant from '../ActionConstants.js';

export const showNotification = (payload) => ({
  type: ActionConstant.SHOW_NOTIFICATION,
  payload: {
    open: true,
    message: payload,
  },
});

export const hideNotification = () => ({
  type: ActionConstant.HIDE_NOTIFICATION,
  payload: {
    open: false,
    message: '',
  },
});
