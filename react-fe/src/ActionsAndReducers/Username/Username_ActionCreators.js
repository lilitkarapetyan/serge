import ActionConstant from '../ActionConstants.js';

export const changeUsername = (name) => ({
    type: ActionConstant.CHANGE_USERNAME,
    payload: name
});