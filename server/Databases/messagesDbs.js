var PouchDB = require('pouchdb-core');
PouchDB.plugin(require('pouchdb-adapter-leveldb'));
require('pouchdb-all-dbs')(PouchDB);

var _ = require('lodash');
var uniqid = require('uniqid');

var consts = require("../consts");

var db = new PouchDB(consts.MSG_STORE, {adapter: 'leveldb'});



var messages = (function() {

  var addMessage = function (messageDetail, schema) {
    return new Promise((resolve, reject) => {

      let time = new Date().toISOString();

      let message = {
        _id: time,
        lastUpdated: time,
        details: messageDetail,
        schema: schema,
        completed: false
      };

      return db.put(message)
        .then(function (result) {
          resolve(result);
        })
        .catch(function (err) {
          console.log(err);
          reject(false);
        })
    });
  };

  var createMessage = function (message, schema) {

    return new Promise((resolve, reject) => {
      (async() => {

        const allMessages = await getAllMessages();
        const matchedName = allMessages.find((el) => el.details.title === message.title && el._id !== message.id);

        if (matchedName) {
          reject("Message title already used");
          return;
        }

        const addToDB = await addMessage(message, schema);
        resolve(addToDB);

      })();
    });
  };

  var duplicateMessage = function (id) {

    let time = new Date().toISOString();

    return new Promise((resolve, reject) => {
      db.get(id)
        .then(function (doc) {

          var updatedMessage = doc.details;
          // updatedMessage.title = `${updatedMessage.title}~${moment(time).format("hh:mm:ss:SS")}`;
          updatedMessage.title = `${updatedMessage.title} Copy-${uniqid.time()}`;

          return db.put({
            _id: time,
            lastUpdated: time,
            details: updatedMessage,
            schema: doc.schema
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

  var updateMessage = function (id, message) {
    return new Promise((resolve, reject) => {
      (async() => {

        const allMessages = await getAllMessages();
        const matchedName = allMessages.find((el) => el.details.title === message.title && el._id !== id);

        if (matchedName) {
          reject("Message title already used");
          return;
        }

        db.get(id)
          .then(function (doc) {
            return db.put({
              _id: id,
              lastUpdated: new Date().toISOString(),
              _rev: doc._rev,
              details: message,
              schema: doc.schema
            });
          })
          .then(function (result) {
            resolve(result);
          })
          .catch(function (err) {
            console.log(err);
            reject(false);
          });

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
      db.get(id, {include_docs: true}, function(err, doc) {
        if (err) reject('something went wrong');
        resolve(doc);
      });
    });
  };

  var getAllMessages = function () {

    return new Promise((resolve, reject) => {
      return db.changes({
        since: 0,
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

  return {
    createMessage: createMessage,
    duplicateMessage: duplicateMessage,
    updateMessage: updateMessage,
    deleteMessage: deleteMessage,
    getAllMessages: getAllMessages,
    getMessage: getMessage,
  }

})();


module.exports = messages;
