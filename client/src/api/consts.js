export const serverPath = 'https://serge-dev.herokuapp.com/';
export const databasePath = 'https://serge-dev.herokuapp.com/db/';
// export const serverPath = 'http://localhost:8080/';
// export const databasePath = 'http://localhost:8080/db/';

export const MSG_STORE = "messages";
export const MSG_TYPE_STORE = "message_types";

export const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST',
  'Access-Control-Allow-Headers': 'Authorization, Lang'
};

export const forceTemplate = {
  forceName: '',
  overview: 'An overview written here..',
  roles: [{
    name: 'General',
    control: false,
  }],
  umpire: false,
  dirty: false,
};

export const umpireForceTemplate = {
  forceName: 'White',
  overview: 'Umpire force.',
  roles: [{
    name: 'Game Control',
    control: true,
  }],
  umpire: true,
  dirty: false,
};

// export const channelTemplate = [];

export const channelTemplate = {
  channelName: '',
  participants: [],
};

export const dbDefaultSettings = {
  _id: '_local/settings',
  wargameTitle: '',
  data: {
    overview: {
      name: "Overview - settings",
      gameDescription: '',
      spatialRepresentation: '',
      planningInterval: null,
      replayInterval: null,
      turnStrategy: '',
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
  gameTurn: 0,
  gameTime: null,
};
