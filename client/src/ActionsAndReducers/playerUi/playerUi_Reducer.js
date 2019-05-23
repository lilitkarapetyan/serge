import ActionConstant from '../ActionConstants';
import copyState from "../../Helpers/copyStateHelper";
import _ from "lodash";

const initialState = {
  selectedForce: '',
  selectedRole: '',
  controlUi: false,
  currentTurn: 0,
  selectedChannel: '',
  currentWargame: '',
  wargameTitle: '',
  channels: {},
  allChannels: {},
  forces: {},
  allForces: {},
  messageSchema: {},
  messages: [],
  wargameInitiated: false,
};

export const playerUiReducer = (state = initialState, action) => {

  let newState = copyState(state);

  switch (action.type) {

    case ActionConstant.SET_CURRENT_WARGAME_PLAYER:

      newState.currentWargame = action.payload.name;
      newState.wargameTitle = action.payload.wargameTitle;
      newState.currentTurn = action.payload.gameTurn;
      newState.wargameInitiated = action.payload.wargameInitiated;
      newState.gameDescription = action.payload.data.overview.gameDescription;

      newState.allChannels = action.payload.data.channels.channels;
      newState.allForces = action.payload.data.forces.forces;

      break;

    case ActionConstant.SET_FORCE:
      newState.selectedForce = action.payload;
      break;

    case ActionConstant.SET_ROLE:
      newState.selectedRole = action.payload.name;
      newState.controlUi = action.payload.control;
      break;

    case ActionConstant.SET_FILTERED_CHANNELS:

      let channels = {};

      newState.allChannels.forEach((channel) => {

        let participants = channel.participants.filter((p) => p.forceUniqid === newState.selectedForce && p.roles.some((role) => role.value === newState.selectedRole));
        let channelActive = channel.participants.some((p) => p.forceUniqid === newState.selectedForce && p.roles.some((role) => role.value === newState.selectedRole));

        participants = _.uniqWith(participants, _.isEqual);

        if (channelActive) {
          channels[channel.uniqid] = {
            name: channel.name,
            templates: _.flatMap(participants, (participant) => participant.templates),
            // messages: []
          };
        }

        if (action.setSelectedChannel) newState.selectedChannel = Object.keys(channels)[0]; // this needs to be ignored

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
