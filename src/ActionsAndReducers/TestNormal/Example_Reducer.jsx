import ActionConstant from '../ActionConstants';

export const updateName = (state = '', action) => {
    switch (action.type) {
        case ActionConstant.NORMAL_ACTION:
            return state = action.payload;
        default:
            return state = '';
    }
};