import ActionConstant from '../ActionConstants';

export const setCurrentTab = (tab) => ({
  type: ActionConstant.SET_CURRENT_GAME_SETUP_TAB,
  payload: tab
});

export const setGameData = (data) => ({
  type: ActionConstant.SET_GAME_SETUP_DATA,
  payload: data,
});

export const addNewForce = (data) => ({
  type: ActionConstant.ADD_NEW_FORCE,
  payload: data,
});
