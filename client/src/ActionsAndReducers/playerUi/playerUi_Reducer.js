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

      newState.allChannels = action.payload.data.channels.channels;
      newState.allForces = action.payload.data.forces.forces;

      break;

    case ActionConstant.SET_FORCE:
      newState.selectedForce = action.payload;
      break;

    case ActionConstant.SET_ROLE:
      newState.selectedRole = action.payload;
      break;

    case ActionConstant.SET_FILTERED_CHANNELS:

      let channels = {};

      newState.allChannels.forEach((channel) => {

        let participants = channel.participants.filter((p) => p.force === newState.selectedForce && p.role === newState.selectedRole);
        let channelActive = channel.participants.some((p) => p.force === newState.selectedForce && p.role === newState.selectedRole);

        participants = _.uniqWith(participants, _.isEqual);

        if (channelActive) {
          channels[channel.channelName] = {
            templates: _.flatMap(participants, (participant) => participant.templates),
            messages: []
          };
        }

        newState.selectedChannel = Object.keys(channels)[0];
        newState.channels = channels;

      });

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
