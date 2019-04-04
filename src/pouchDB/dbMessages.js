import PouchDB from 'pouchdb-browser';
import pouchFind from 'pouchdb-find';

import deepCopy from "../ActionsAndReducers/copyStateHelper.js";
import moment from "moment";

PouchDB.plugin(pouchFind);
var db = new PouchDB('messages');

window.clearDatabase2 = function() {
  db.destroy().then(function(res) {
    console.log('database 2 cleared');
  });
};

/*
 * Subscribes to changes to the database, increase max listeners from 10, create db.
 */
db.setMaxListeners(15);

var opts = {live: true};
db.replicate.to(db, opts, () => 'An Error has occurred.');
db.replicate.from(db, opts, () => 'An Error has occurred.');


/**
 * @param message
 * @type object
 */
export function addMessageInDb(messageObj, schema) {

  return new Promise((resolve, reject) => {
    (async() => {

      const allMessages = await getAllMessagesFromDB();
      const matchedName = allMessages.find((el) => el.details.title === messageObj.title && el._id !== messageObj.id);

      if (matchedName) {
        reject("Message title already used");
        return;
      }

      const addToDB = await createMessage(messageObj, schema);
      resolve(addToDB);

    })();
  });
}

function createMessage(messageObj, schema) {
  return new Promise((resolve, reject) => {

    let time = new Date().toISOString();

    let message = {
      _id: time,
      lastUpdated: time,
      details: messageObj,
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
}


export function duplicateMessageDB(messageId) {

  let time = new Date().toISOString();

  return new Promise((resolve, reject) => {
    db.get(messageId)
      .then(function (doc) {

        var updatedMessage = deepCopy(doc.details);
            updatedMessage.title = `${updatedMessage.title}~${moment(time).format("hh:mm:ss")}`;

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
}


export function updateMessageInDB(message, id) {

  return new Promise((resolve, reject) => {
    (async() => {

      const allMessages = await getAllMessagesFromDB();
      const matchedName = allMessages.find((el) => el.details.title === message.title && el._id !== id);

      if (matchedName) {
        reject("Message title already used");
        return;
      }

      const addToDB = await updateMessage(message, id);

      resolve(addToDB);

    })();
  });
}

function updateMessage(message, id) {
  return new Promise((resolve, reject) => {
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
      })
  });
}


export function deleteMessageDB(messageId) {
  return new Promise((resolve, reject) => {
    db.get(messageId)
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
}


export function getMessageFromDB(id) {
  return new Promise((resolve, reject) => {
    db.get(id, {include_docs: true}, function(err, doc) {
      if (err) reject('something went wrong');
      resolve(doc);
    });
  });
}

export function getAllMessagesFromDB() {
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
}