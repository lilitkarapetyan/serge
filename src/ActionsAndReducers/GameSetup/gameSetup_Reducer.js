import ActionConstant from '../ActionConstants';
import deepCopy from "../copyStateHelper.js";
import _ from "lodash";


const initialState = {
  tabs: {
    0: {
      name: "Overview - settings",
      data: {
        gameDescription: '',
        spatialRepresentation: '',
        planningInterval: null,
        replayInterval: null,
        turnStrategy: '',
      },
      complete: false,
    },
    // 1: {
    //   name: "Platform Types",
    //   complete: false,
    // },
    1: {
      name: "Forces",
      data: {
        forces: [],
      },
      complete: false,
    },
    // 3: {
    //   name: "Back history",
    //   complete: false,
    // },
    // 4: {
    //   name: "Positions",
    //   complete: false,
    // },
    2: {
      name: "Channels",
      data: {},
      complete: false,
    },
    // 6: {
    //   name: "Play control",
    //   complete: false,
    // },
  },
  currentTab: 0
};

export const gameSetupReducer = (state = initialState, action) => {

  let newState = deepCopy(state);

  let tab = newState.currentTab;

  switch (action.type) {
    case ActionConstant.SET_CURRENT_GAME_SETUP_TAB:
      newState.currentTab = action.payload;
      break;

    case ActionConstant.SET_GAME_SETUP_DATA:
      newState.tabs[tab].data = {...newState.tabs[tab].data, ...action.payload};
      break;

    case ActionConstant.ADD_NEW_FORCE:
      newState.tabs[tab].data.forces = newState.tabs[tab].data.forces.concat(action.payload);
      break;

    default:
      break;
  }

  newState.tabs[tab].complete = Object.values(newState.tabs[tab].data).every((item) => item !== null && item.length > 0);

  return newState;
};
