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
  roles: ['General']
};

// export const channelTemplate = [];

export const channelTemplate = {
  channelName: '',
  participants: [],
};

// export const overviewTab = 0;
// export const forcesTab = 1;
// export const channelsTab = 2;

// export const dbDefaultSettings = {
//   _id: '_local/settings',
//   wargameTitle: 'wargame',
//   tabs: {
//     [overviewTab]: {
//       name: "Overview - settings",
//       data: {
//         gameDescription: '',
//         spatialRepresentation: '',
//         planningInterval: null,
//         replayInterval: null,
//         turnStrategy: '',
//       }
//     },
//     [forcesTab]: {
//       name: "Forces",
//       data: {
//         forces: {},
//         roles: ['General'],
//         selectedForce: '',
//       },
//     },
//     [channelsTab]: {
//       name: "Channels",
//       data: {
//         channels: {},
//         selectedChannel: '',
//       },
//     }
//   }
// };

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
    },
    forces: {
      name: "Forces",
      forces: [],
      roles: ['General'],
      selectedForce: '',
      complete: false,
    },
    channels: {
      name: "Channels",
      channels: [],
      selectedChannel: '',
      complete: false,
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
