var PouchDB = require('pouchdb-core');
PouchDB.plugin(require('pouchdb-adapter-leveldb'));
require('pouchdb-all-dbs')(PouchDB);

var uniqid = require('uniqid');

var consts = require("../consts");
var machineryFailure = require('../Schemas/machinery_failure.json');
var weatherForecast = require('../Schemas/weather_forecase.json');

var db = new PouchDB(consts.MSG_TYPE_STORE, {adapter: 'leveldb'});

var populateDb = function () {
  var machine = {
    _id: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    title: 'machinery failure',
    details: machineryFailure,
    completed: false
  };
  db.put(machine);

  setTimeout(function () {
    var weather = {
      _id: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      title: 'weather forecast',
      details: weatherForecast,
      completed: false
    };
    db.put(weather).then(() => {
      console.log('DATA BASE COMPLETE');
    });
  },2000);
};

db.allDocs().then(entries => {
  if (entries.rows.length === 0) {
    populateDb();
  }
});

var messageTypes = (function() {

  var addMessageType = function (schema) {
    return new Promise((resolve, reject) => {
      (async() => {

        const allMessages = await getAllMessages();

        const matchedName = allMessages.find((messageType) => messageType.title.toLowerCase() === schema.title.toLowerCase());

        if (matchedName) {
          reject("Message title already used");
          return;
        }

        const addToDB = await createAndAddNewMessageType(schema);
        resolve(addToDB);

      })();
    });
  };

  var createAndAddNewMessageType = function(schema) {
    return new Promise((resolve, reject) => {

      let time = new Date().toISOString();

      var schemaObj = {
        _id: time,
        lastUpdated: time,
        title: schema.title,
        details: schema,
        completed: false
      };

      return db.put(schemaObj)
        .then(function (result) {
          resolve(result);
        })
        .catch(function (err) {
          console.log(err);
          reject(false);
        })
    });
  };

  var getAllMessages = function () {
    return new Promise((resolve, reject) => {
      return db.changes({
        since: 1,
        include_docs: true,
        descending: true,
      })
        .then(function (changes) {

          let results = changes.results.map((a) => a.doc);
          results = results.filter((a) => !a.hasOwnProperty('_deleted') && a.hasOwnProperty('details'));

          resolve(results);
        })
        .catch(function (err) {
          // handle errors
          reject(err);
          console.log(err);
        });
      });
  };

  var duplicateMessage = function (id) {

    let time = new Date().toISOString();

    return new Promise((resolve, reject) => {
      db.get(id)
        .then(function (doc) {
          // var updatedMessage = deepCopy(doc.details);
          var updatedMessage = doc.details;
          // updatedMessage.title = `${updatedMessage.title}~${moment(time).format("hh:mm:ss:SS")}`;
          updatedMessage.title = `${updatedMessage.title} Copy-${uniqid.time()}`;

          return db.put({
            _id: time,
            lastUpdated: time,
            title: updatedMessage.title,
            details: updatedMessage,
          });
        })
        .then(function () {
          resolve(true);
        })
        .catch(function (err) {
          console.log(err);
          reject(false);
        })
    });
  };

  var updateMessage = function (id, schema) {
    return new Promise((resolve, reject) => {
      (async() => {

        const allMessages = await getAllMessages();

        const matchedName = allMessages.find((messageType) => messageType.title.toLowerCase() === schema.title.toLowerCase());

        if (matchedName) {
          reject("Message title already used");
          return;
        }

        db.get(id)
          .then(function (doc) {
            return db.put({
              _id: doc._id,
              lastUpdated: new Date().toISOString(),
              _rev: doc._rev,
              title: schema.title,
              details: schema
            });
          })
          .then(function (result) {
            resolve(result);
          })
          .catch(function (err) {
            console.log(err);
            reject(false);
          })

      })();
    });
  };

  var deleteMessage = function (id) {
    return new Promise((resolve, reject) => {
      db.get(id)
        .then(function (doc) {
          return db.remove(doc);
        })
        .then(function (result) {
          resolve(result);
        })
        .catch(function (err) {
          console.log(err);
          reject(false);
        })
    });
  };

  var getMessage = function (id) {
    return new Promise((resolve, reject) => {
      db.get(id)
        .then(function (doc) {
          console.log(doc);
          return doc;
        })
        .then(function (result) {
          resolve(result);
        })
        .catch(function (err) {
          console.log(err);
          reject(false);
        })
    });
  };

  return {
    addMessageType: addMessageType,
    getAllMessages: getAllMessages,
    duplicateMessage: duplicateMessage,
    updateMessage: updateMessage,
    deleteMessage: deleteMessage,
    getMessage: getMessage,
  }

})();


module.exports = messageTypes;
