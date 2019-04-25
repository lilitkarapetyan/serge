const uniqid = require('uniqid');

const appRoot = require('app-root-path');

const forceTemplate = {
  overview: 'An overview written here..',
  roles: ['General']
};

const channelTemplate = [{
  force: 'white',
  role: 'General',
  template: {
    name: '',
    id: ''
  },
  subscriptionId: uniqid.time(),
}];

const consts = {
  databasePath: appRoot + '/db_files/',
  MSG_STORE: "messages",
  MSG_TYPE_STORE: "message_types",
  channelTemplate: channelTemplate,
  forceTemplate: forceTemplate,
  dbDefaultSettings: {
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
  }
};

module.exports = consts;
