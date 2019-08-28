const server = require("./server");
const opn = require('opn');

if(process.argv[2]) {
  console.log(`running client with remote server "${process.argv[2]}"`);
}
else {
  console.log("running client with local server");
  console.log("(You can give the second parameter as the remote server URL)");
}

const port = process.env.PORT || 8080;

server(
  82,                                   //event emmiter max listeners
  { prefix: 'db/', adapter: 'websql' }, //PouchDb Options
  {},                                   //cors options
  './db',                               //database directory
  './img',                              //images directory
  port,                                 //port
  process.argv[2] || null,              //remote server path
);

opn(`http://localhost:${port}/serge/admin`);
