import ActionConstant from '../ActionConstants';
import chat from "../../Schemas/chat.json";
import copyState from "../../Helpers/copyStateHelper";
import {CHAT_CHANNEL_ID} from "../../consts";
import _ from "lodash";
import uniqId from "uniqid";

const initialState = {
  selectedForce: '',
  selectedRole: '',
  isObserver: false,
  controlUi: false,
  currentTurn: 1,
  phase: '',
  gameDate: '',
  gameTurnTime: 0,
  realtimeTurnTime: 0,
  turnEndTime: '',
  gameDescription: '',
  currentWargame: '',
  wargameTitle: '',
  chatChannel: {
    name: CHAT_CHANNEL_ID,
    template: chat,
    messages: [],
  },
  channels: {},
  allChannels: [],
  allForces: [],
  allTemplates: [],
  showObjective: false,
  wargameInitiated: false,
  feedbackMessages: [],
};

export const playerUiReducer = (state = initialState, action) => {

  let newState = copyState(state);

  let messages;
  let index;

  switch (action.type) {

    case ActionConstant.SET_CURRENT_WARGAME_PLAYER:
      newState.currentWargame = action.payload.name;
      newState.wargameTitle = action.payload.wargameTitle;
      newState.wargameInitiated = action.payload.wargameInitiated;
      newState.currentTurn = action.payload.gameTurn;
      newState.phase = action.payload.phase;
      newState.gameDate = action.payload.gameDate;
      newState.gameTurnTime = action.payload.gameTurnTime;
      newState.realtimeTurnTime = action.payload.realtimeTurnTime;
      newState.timeWarning = action.payload.timeWarning;
      newState.turnEndTime = action.payload.turnEndTime;
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
      newState.isObserver = action.payload.isObserver;
      break;

    case ActionConstant.SET_ALL_TEMPLATES_PLAYERUI:
      newState.allTemplates = action.payload;
      break;

    case ActionConstant.SHOW_HIDE_OBJECTIVES:
      newState.showObjective = !newState.showObjective;
      break;

    case ActionConstant.SET_FEEDBACK_MESSAGES:
      newState.feedbackMessages = action.payload;
      break;

    case ActionConstant.SET_LATEST_FEEDBACK_MESSAGE:
      newState.feedbackMessages.unshift(action.payload);
      break;

    case ActionConstant.SET_LATEST_WARGAME_MESSAGE:

      if (action.payload.hasOwnProperty('infoType') && action.payload.phase === "planning") {
        let message = {
          details: {
            channel: `infoTypeChannelMarker${uniqId.time()}`
          },
          infoType: true,
          gameTurn: action.payload.gameTurn,
        };

        for (let channelId in newState.channels) {
          let matchedChannel = newState.allChannels.find((channel) => channel.uniqid === channelId);
          if (!matchedChannel) {
            delete newState.channels[channelId];
          } else {
            let channelActive = matchedChannel.participants.some((p) => p.forceUniqid === newState.selectedForce && p.roles.some((role) => role.value === newState.selectedRole));
            if (!channelActive) delete newState.channels[channelId];
          }
        }

        newState.allChannels.forEach((channel) => {

          let channelActive = channel.participants.some((p) => p.forceUniqid === newState.selectedForce && p.roles.some((role) => role.value === newState.selectedRole));
          let allRoles = channel.participants.some((p) => p.forceUniqid === newState.selectedForce && p.roles.length === 0);

          if (
            (channelActive || allRoles) &&
            !!newState.channels[channel.uniqid] &&
            !newState.channels[channel.uniqid].messages.find((prevMessage) => prevMessage.gameTurn === message.gameTurn)
          ) {
            newState.channels[channel.uniqid].messages.unshift(message);
          }

          if (
            (channelActive || allRoles) &&
            !newState.channels[channel.uniqid]
          ) {

            let participant = channel.participants.find((p) => p.forceUniqid === newState.selectedForce);
            if (participant === undefined) return;

            let noTemplates = participant.templates.length === 0;

            let templates;
            if (noTemplates) {
              templates = newState.allTemplates.filter((template) => template.title === "Chat");
            } else {
              templates = participant.templates.map((template) => template.value);
            }

            newState.channels[channel.uniqid] = {
              name: channel.name,
              templates,
              forceIcons: channel.participants.filter((participant) => participant.forceUniqid !== newState.selectedForce).map((participant) => participant.icon),
              messages: [],
              unreadMessageCount: 0,
            };
          }

        });

      } else if (!action.payload.hasOwnProperty('infoType')) {

        if (action.payload.details.channel === CHAT_CHANNEL_ID) {
          newState.chatChannel.messages.unshift(action.payload);
        } else {
          newState.channels[action.payload.details.channel].messages.unshift({...action.payload, hasBeenRead: false, isOpen: false});
          newState.channels[action.payload.details.channel].unreadMessageCount++;
        }
      }

      break;

    case ActionConstant.SET_ALL_MESSAGES:

      let channels = {};

      messages = action.payload.map((message) => {
        if (message.hasOwnProperty('infoType')) {
          return {
            details: {
              channel: `infoTypeChannelMarker${uniqId.time()}`
            },
            infoType: true,
            gameTurn: message.gameTurn,
          }
        }
        return {...message, hasBeenRead: false, isOpen: false};
      });

      let reduceTurnMarkers = (message) => {
        if (message.infoType) {
          return message.gameTurn;
        } else {
          return message._id;
        }
      };

      messages = _.uniqBy(messages, reduceTurnMarkers);

      newState.chatChannel.messages = messages.filter((message) => message.details.channel === newState.chatChannel.name);

      newState.allChannels.forEach((channel) => {

        let channelActive = channel.participants.some((p) => p.forceUniqid === newState.selectedForce && p.roles.some((role) => role.value === newState.selectedRole));
        let allRoles = channel.participants.some((p) => p.forceUniqid === newState.selectedForce && p.roles.length === 0);

        let participant = channel.participants.find((p) => p.forceUniqid === newState.selectedForce);

        if (participant === undefined) return;

        let noTemplates = participant.templates.length === 0;

        let templates;
        if (noTemplates) {
          templates = newState.allTemplates.filter((template) => template.title === "Chat");
        } else {
          templates = participant.templates.map((template) => template.value);
        }

        if (channelActive || allRoles || newState.isObserver) {
          channels[channel.uniqid] = {
            name: channel.name,
            templates: newState.isObserver && !channelActive ? [] : templates,
            forceIcons: channel.participants.filter((participant) => participant.forceUniqid !== newState.selectedForce).map((participant) => participant.icon),
            messages: messages.filter((message) => message.details.channel === channel.uniqid || message.infoType === true),
            unreadMessageCount: messages.filter((message) => message.details.channel === channel.uniqid).length,
          };
        }

        newState.channels = channels;

      });

      break;

    case ActionConstant.OPEN_MESSAGE:

      messages = newState.channels[action.payload.channel].messages;

      action.payload.message.isOpen = true;
      action.payload.message.hasBeenRead = true;
      index = messages.findIndex((item) => item._id === action.payload.message._id);
      messages.splice(index, 1, action.payload.message);
      newState.channels[action.payload.channel].messages = messages;

      let unreadMessages = newState.channels[action.payload.channel].messages.filter((message) => {
        return !message.hasOwnProperty("infoType") && !message.hasBeenRead;
      });

      newState.channels[action.payload.channel].unreadMessageCount = unreadMessages.length;

      break;

    case ActionConstant.CLOSE_MESSAGE:

      messages = newState.channels[action.payload.channel].messages;
      action.payload.message.isOpen = false;
      index = messages.findIndex((item) => item._id === action.payload.message._id);
      messages.splice(index, 1, action.payload.message);
      newState.channels[action.payload.channel].messages = messages;

      break;

    case ActionConstant.MARK_ALL_AS_READ:

      newState.channels[action.payload].messages.forEach((message) => {
        if (message.hasOwnProperty("hasBeenRead")) message.hasBeenRead = true;
      });
      newState.channels[action.payload].unreadMessageCount = 0;

      break;

    default:
      return newState;
  }

  return newState;
};
