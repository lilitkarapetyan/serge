import uniqId from "uniqid";

export const serverPath = process.env.REACT_APP_SERVER_PATH;
// export const serverPath = 'http://localhost:8080/';
/*
for development just create .env.local file in client folder and add line,
it's under gitignore and you don't need change this value before every deployment:
REACT_APP_SERVER_PATH='http://localhost:8080/'
*/

export const databasePath = `${serverPath}db/`;

export const MSG_STORE = "messages";
export const MSG_TYPE_STORE = "message_types";
export const CHAT_CHANNEL_ID = "game-admin";
export const POLL_TIMEOUT = 250;

export const PLANNING_PHASE = 'planning';
export const ADJUDICATION_PHASE = 'adjudication';

export const MAX_LISTENERS = 82;
export const LONG_POLLING = true;

export const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Headers': 'Authorization, Lang'
};

export const forceTemplate = {
  name: '',
  uniqid: null,
  overview: 'An overview written here..',
  roles: [{
    name: 'General',
    password: `pass${uniqId.time()}`,
    control: false,
    isObserver: false,
  }],
  icon: serverPath+'default_img/forceDefault.png',
  color: '#0000ff',
  umpire: false,
  dirty: false,
};

export const umpireForceTemplate = {
  name: 'White',
  uniqid: 'umpire',
  overview: 'Umpire force.',
  roles: [{
    name: 'Game Control',
    password: `pass${uniqId.time()}`,
    control: true,
    isObserver: true,
  }],
  icon: serverPath+'default_img/umpireDefault.png',
  color: '#FFFFFF',
  umpire: true,
  dirty: false,
};

// export const channelTemplate = [];

export const channelTemplate = {
  name: '',
  uniqid: '',
  participants: [],
};

export const dbDefaultSettings = {
  _id: '_local/settings',
  wargameTitle: '',
  data: {
    overview: {
      name: "Overview - settings",
      gameDescription: '',
      // spatialRepresentation: '',
      gameTurnTime: null,
      realtimeTurnTime: null,
      timeWarning: 1000,
      // turnStrategy: '',
      startTime: new Date().toISOString(),
      complete: false,
      dirty: false,
    },
    forces: {
      name: "Forces",
      forces: [umpireForceTemplate],
      selectedForce: '',
      complete: false,
      dirty: false,
    },
    channels: {
      name: "Channels",
      channels: [],
      selectedChannel: '',
      complete: false,
      dirty: false,
    }
  },
  wargameInitiated: false,
  gameTurn: 1,
  phase: '',
  gameDate: null,
  gameTurnTime: null,
  realtimeTurnTime: null,
  turnEndTime: null,
};
