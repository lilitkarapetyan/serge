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
  overview: 'An overview written here..',
  roles: ['General']
};

export const channelTemplate = [];


export const dbDefaultSettings = {
  _id: '_local/settings',
  wargameTitle: 'wargame',
  tabs: {
    0: {
      name: "Overview - settings",
      data: {
        gameDescription: '',
        spatialRepresentation: '',
        planningInterval: null,
        replayInterval: null,
        turnStrategy: '',
      }
    },
    1: {
      name: "Forces",
      data: {
        forces: {},
        roles: ['General'],
        selectedForce: '',
      },
    },
    2: {
      name: "Channels",
      data: {
        channels: {},
        selectedChannel: '',
      },
    }
  }
};


// export const channelTemplate = [{
//   force: 'white',
//   role: 'General',
//   template: {
//     name: '',
//     id: '',
//   },
//   // subscriptionId: uniqid.time(),
// }];
