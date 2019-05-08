import ActionConstant from '../ActionConstants';
import copyState from "../copyStateHelper.js";
// import _ from "lodash";
import uniqId from "uniqid";

import {
  forceTemplate,
  channelTemplate,
  dbDefaultSettings,
} from "../../api/consts";

var initialState = {
  isLoading: false,
  wargameList: [],
  currentWargame: '',
  wargameTitle: '',
  validation: {
    validWargameName: true,
    validForceName: true,
    validChannelName: true,
  },
  data: {...dbDefaultSettings.data},
  currentTab: Object.keys(dbDefaultSettings.data)[0],
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
  let participantIndex;
  let listWithoutThis;
  let uniqueName;

  switch (action.type) {

    case ActionConstant.ALL_WARGAME_NAMES_SAVED:
      newState.wargameList = action.payload;
      return newState;

    case ActionConstant.SET_CURRENT_WARGAME:

      newState.currentWargame = action.payload.name;
      newState.wargameTitle = action.payload.wargameTitle;
      newState.data = action.payload.data;
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
      newState.data[tab] = {...newState.data[tab], ...action.payload};
      newState.unsavedState = true;
      break;

    case ActionConstant.ADD_NEW_FORCE:

      let newForce = forceTemplate;
      newForce.forceName = action.payload;

      newState.data[tab].forces.push(newForce);
      newState.unsavedState = true;
      break;

    case ActionConstant.SET_SELECTED_FORCE:
      newState.data[tab].selectedForce = action.payload;
      newState.unsavedState = true;
      break;

    case ActionConstant.ADD_NEW_CHANNEL:

      let newChannel = channelTemplate;
      newChannel.channelName = action.payload;
      newState.data[tab].channels.push(newChannel);
      newState.unsavedState = true;
      break;

    case ActionConstant.UPDATE_CHANNEL_NAME:

      listWithoutThis = [];

      let selectedChannel = newState.data[tab].data.selectedChannel;
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
      newState.data[tab].selectedChannel = action.payload;
      break;

    case ActionConstant.DELETE_SELECTED_CHANNEL:

      let channelIndex = newState.data[tab].channels.findIndex((channel) => channel.channelName === action.payload);

      console.log(channelIndex);
      console.log(newState.data[tab].channels);

      newState.data[tab].channels.splice(channelIndex, 1);
      newState.data[tab].selectedChannel = '';
      break;

    case ActionConstant.SET_FORCE_OVERVIEW:
      let selected = newState.data[tab].selectedForce;
      newState.data[tab].forces.find((f) => f.forceName === selected).overview = action.payload;
      newState.unsavedState = true;
      break;

    case ActionConstant.ADD_NEW_RECIPIENT:
      curChannel = newState.data[tab].selectedChannel;
      let newParticipant = {...action.payload, subscriptionId: uniqId.time()};
      newState.data[tab].channels.find((c) => c.channelName === curChannel).participants.push(newParticipant);
      newState.unsavedState = true;
      break;

    case ActionConstant.UPDATE_RECIPIENT:
      curChannel = newState.data[tab].selectedChannel;
      participantIndex = newState.data[tab].channels.find((c) => c.channelName === curChannel).participants.findIndex((participant) => participant.subscriptionId === action.payload.id);
      newState.data[tab].channels.find((c) => c.channelName === curChannel).participants.splice(participantIndex, 1, {...action.payload.data, subscriptionId: action.payload.id});
      newState.unsavedState = true;
      break;

    case ActionConstant.REMOVE_RECIPIENT:
      curChannel = newState.data[tab].selectedChannel;
      participantIndex = newState.data[tab].channels.find((c) => c.channelName === curChannel).participants.findIndex((participant) => participant.subscriptionId === action.payload);
      console.log(participantIndex);
      newState.data[tab].channels.find((c) => c.channelName === curChannel).participants.splice(participantIndex, 1);
      newState.unsavedState = true;
      break;

    case ActionConstant.SET_UNSAVED_STATE:
      newState.unsavedState = action.unsaved;
      break;

    default:
      return newState;
  }

  // // pagination completion bar at top of gameDesigner page
  // let flatten = (n) => {
  //   if (_.isEmpty(n)) return null; // force show empty array
  //   return (_.isArray(n) || _.isObject(n)) ? _.flatMapDeep(n, flatten) : n;
  // };
  //
  // let inputResults = _.flatMapDeep(newState.tabs[tab].data, flatten);
  //
  // newState.tabs[tab].complete = inputResults.every((item) => item !== null && item.length > 0);

  return newState;
};
