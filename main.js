const server = require("./server");

server(
  82,                                   //event emmiter max listeners
  { prefix: 'db/', adapter: 'websql' }, //PouchDb Options
  {},                                   //cors options
  './db',                               //database directory
  './img',                              //images directory
  process.env.PORT || 8080,             //port
  null,                                 //remote server path
);
