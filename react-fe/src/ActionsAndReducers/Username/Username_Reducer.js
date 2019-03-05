import ActionConstant from '../ActionConstants.js';

export const updateName = (state = '', action) => {
    switch (action.type) {
        case ActionConstant.CHANGE_USERNAME:
            return state = action.payload;
        default:
            return state;
    }
};