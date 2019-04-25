import ActionConstant from '../ActionConstants';
import copyState from "../../Helpers/copyStateHelper";
import _ from "lodash";

const initialState = {
  selectedForce: '',
  selectedRole: '',
  selectedChannel: '',
  currentWargame: '',
  wargameTitle: '',
  channels: {},
  allChannels: {},
  forces: {},
  allForces: {},
  messageSchema: {},
  messages: [],
};

export const playerUiReducer = (state = initialState, action) => {

  let newState = copyState(state);

  switch (action.type) {

    case ActionConstant.SET_CURRENT_WARGAME_PLAYER:

      newState.currentWargame = action.payload.name;
      newState.wargameTitle = action.payload.wargameTitle;

      let channelsTab = Object.values(action.payload.tabs).find((obj) => obj.name === "Channels");
      newState.allChannels = channelsTab.data.channels;

      let forcesTab = Object.values(action.payload.tabs).find((obj) => obj.name === "Forces");
      newState.allForces = forcesTab.data.forces;
      break;

    case ActionConstant.SET_FORCE:
      newState.selectedForce = action.payload;
      break;

    case ActionConstant.SET_ROLE:
      newState.selectedRole = action.payload;
      break;

    case ActionConstant.SET_FILTERED_CHANNELS:

      let channels = {};
      for (let channel in newState.allChannels) {

        let channelParticipants = newState.allChannels[channel].filter((recipient) => recipient.force === newState.selectedForce && recipient.role === newState.selectedRole);
        let channelActive = newState.allChannels[channel].some((recipient) => recipient.force === newState.selectedForce && recipient.role === newState.selectedRole);

        // only allow unique participants in gameSetup but check here also
        channelParticipants = _.uniqWith(channelParticipants, _.isEqual);

        if (channelActive) {
          channels[channel] = {
            templates: _.flatMap(channelParticipants, (participant) => participant.templates),
            messages: []
          };
        }
      }
      newState.selectedChannel = Object.keys(channels)[0];
      newState.channels = channels;
      break;

    case ActionConstant.SET_CHANNEL:
      newState.selectedChannel = action.payload;
      break;

    case ActionConstant.SET_MESSAGE_SCHEMA:
      newState.messageSchema = action.payload;
      break;

    case ActionConstant.SET_LATEST_MESSAGES:
      newState.messages = action.payload;
      break;

    default:
      return newState;
  }

  return newState;
};
