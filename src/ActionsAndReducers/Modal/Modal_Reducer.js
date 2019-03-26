import ActionConstant from '../ActionConstants.js';
import copyState from "../copyStateHelper.js";


export const currentModal = (state = {}, action) => {

    let newState = copyState(state);

    switch (action.type) {
      case ActionConstant.OPEN_MODAL:
            return newState = action.payload;
        case ActionConstant.CLOSE_MODAL:
            return newState = action.payload;
        default:
            return newState = {};
    }
};
