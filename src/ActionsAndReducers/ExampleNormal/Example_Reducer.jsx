import ActionConstant from '../ActionConstants';
import copyState from "../copyStateHelper.js";

export const updateName = (state = '', action) => {

    var newState = state;

    switch (action.type) {
        case ActionConstant.NORMAL_ACTION:
            return newState = action.payload;
        default:
            return newState = '';
    }
};