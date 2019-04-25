import uniqid from "uniqid";

export const apiPath = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : 'https://serge-dev.herokuapp.com/api';

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

// export const channelTemplate = [{
//   force: 'white',
//   role: 'General',
//   template: {
//     name: '',
//     id: '',
//   },
//   // subscriptionId: uniqid.time(),
// }];
