import ActionConstant from '../ActionConstants';
import copyState from "../copyStateHelper.js";
import _ from "lodash";
import uniqId from "uniqid";

import {
  forceTemplate,
  channelTemplate,
} from "../../api/consts";

var initialState = {
  isLoading: false,
  wargameList: [],
  currentWargame: '',
  wargameTitle: '',
  validation: {
    validWargameName: true,
    validChannelName: true,
  },
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
        // forces: {'white': forceTemplate},
        forces: {},
        selectedForce: '',
        roles: [],
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
      data: {
        // channels: {'white weather': channelTemplate},
        channels: {},
        selectedChannel: '',
      },
      complete: false,
    },
    // 6: {
    //   name: "Play control",
    //   complete: false,
    // },
  },
  currentTab: 0,
  unsavedState: false,
};

var getNameFromPath = function (dbPath) {
  let path = new URL(dbPath).pathname;
  let index = path.lastIndexOf('/');
  return path.substring(index + 1);
};

export const wargamesReducer = (state = initialState, action) => {

  let newState = copyState(state);

  let tab = newState.currentTab;

  let curChannel;
  let recipientIndex;
  let listWithoutThis;
  let uniqueName;

  switch (action.type) {

    case ActionConstant.ALL_WARGAME_NAMES_SAVED:
      newState.wargameList = action.payload;
      return newState;

    case ActionConstant.SET_CURRENT_WARGAME:
      newState.currentWargame = action.payload.name;
      newState.wargameTitle = action.payload.wargameTitle;
      newState.tabs = action.payload.tabs;
      return newState;

    case ActionConstant.SET_WARGAME_NAME:

      listWithoutThis = [];

      newState.wargameList.forEach((game) => {
        if (getNameFromPath(game.name) !== newState.currentWargame) listWithoutThis.push(game);
      });

      uniqueName = listWithoutThis.every((wargame) => wargame.title !== action.payload );

      newState.validation.validWargameName = uniqueName;
      newState.wargameTitle = action.payload;
      newState.unsavedState = true;
      return newState;

    case ActionConstant.SET_CURRENT_GAME_SETUP_TAB:
      newState.currentTab = action.payload;
      break;

    case ActionConstant.SET_GAME_SETUP_DATA:
      newState.tabs[tab].data = {...newState.tabs[tab].data, ...action.payload};
      newState.unsavedState = true;
      break;

    case ActionConstant.ADD_NEW_FORCE:
      newState.tabs[tab].data.forces[action.payload] = forceTemplate;
      newState.unsavedState = true;
      break;

    case ActionConstant.SET_SELECTED_FORCE:
      newState.tabs[tab].data.selectedForce = action.payload;
      newState.unsavedState = true;
      break;

    case ActionConstant.ADD_NEW_CHANNEL:
      newState.tabs[tab].data.channels[action.payload] = channelTemplate;
      newState.unsavedState = true;
      break;

    case ActionConstant.UPDATE_CHANNEL_NAME:

      listWithoutThis = [];

      let selectedChannel = newState.tabs[tab].data.selectedChannel;
      let channels = Object.keys(newState.tabs[tab].data.channels);

      channels.forEach((channel) => {
        if (channel !== selectedChannel) listWithoutThis.push(channel);
      });

      uniqueName = listWithoutThis.every((channel) => channel !== action.name );

      newState.validation.validChannelName = uniqueName;

      if (uniqueName && action.name !== '') {
        newState.tabs[tab].data.channels[action.name] = newState.tabs[tab].data.channels[selectedChannel];
        newState.tabs[tab].data.selectedChannel = action.name;
        delete newState.tabs[tab].data.channels[selectedChannel];
        newState.unsavedState = true;
      }
      break;

    case ActionConstant.SET_SELECTED_CHANNEL:
      newState.tabs[tab].data.selectedChannel = action.payload;
      break;

    case ActionConstant.DELETE_SELECTED_CHANNEL:
      delete newState.tabs[tab].data.channels[action.payload];
      newState.tabs[tab].data.selectedChannel = '';
      break;

    case ActionConstant.SET_FORCE_OVERVIEW:
      let selected = newState.tabs[tab].data.selectedForce;
      newState.tabs[tab].data.forces[selected].overview = action.payload;
      newState.unsavedState = true;
      break;

    case ActionConstant.ADD_NEW_RECIPIENT:
      curChannel = newState.tabs[tab].data.selectedChannel;
      let newParticipant = {...action.payload, subscriptionId: uniqId.time()};
      newState.tabs[tab].data.channels[curChannel].push(newParticipant);
      newState.unsavedState = true;
      break;

    case ActionConstant.UPDATE_RECIPIENT:
      curChannel = newState.tabs[tab].data.selectedChannel;
      recipientIndex = newState.tabs[tab].data.channels[curChannel].findIndex((recipient) => recipient.subscriptionId === action.payload.id);
      newState.tabs[tab].data.channels[curChannel].splice(recipientIndex, 1, {...action.payload.data, subscriptionId: action.payload.id});
      newState.unsavedState = true;
      break;

    case ActionConstant.REMOVE_RECIPIENT:
      curChannel = newState.tabs[tab].data.selectedChannel;
      recipientIndex = newState.tabs[tab].data.channels[curChannel].findIndex((recipient) => recipient.subscriptionId === action.payload);
      newState.tabs[tab].data.channels[curChannel].splice(recipientIndex, 1);
      newState.unsavedState = true;
      break;

    case ActionConstant.SET_UNSAVED_STATE:
      newState.unsavedState = action.unsaved;
      break;

    default:
      return newState;
  }

  // pagination completion bar at top of gameDesigner page
  let flatten = (n) => {
    if (_.isEmpty(n)) return null; // force show empty array
    return (_.isArray(n) || _.isObject(n)) ? _.flatMapDeep(n, flatten) : n;
  };

  let inputResults = _.flatMapDeep(newState.tabs[tab].data, flatten);

  newState.tabs[tab].complete = inputResults.every((item) => item !== null && item.length > 0);

  return newState;
};
