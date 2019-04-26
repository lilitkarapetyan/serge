import uniqid from "uniqid";

import PouchDB from "pouchdb";
import { databasePath,
         MSG_TYPE_STORE } from "./consts";

import machineryFailure from '../Schemas/machinery_failure.json';
import weatherForecast from '../Schemas/weather_forecase.json';

var db = new PouchDB(databasePath+MSG_TYPE_STORE);

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




export const postNewMessage = (schema) => {

  return new Promise((resolve, reject) => {
    (async() => {

      const allMessages = await getAllMessagesFromDb();

      const matchedName = allMessages.find((messageType) => messageType.title.toLowerCase() === schema.title.toLowerCase());

      if (matchedName) {
        reject("Message title already used");
        return;
      }

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
        });

    })();
  });
};

export const duplicateMessageInDb = (id) => {

  let time = new Date().toISOString();

  return new Promise((resolve, reject) => {
    db.get(id)
      .then(function (doc) {

        // var updatedMessage = doc.details;

        doc.details.title = `${doc.details.title} Copy-${uniqid.time()}`;

        return db.put({
          _id: time,
          lastUpdated: time,
          title: doc.details.title,
          details: doc.details,
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

export const updateMessageInDb = (schema, id) => {
  return new Promise((resolve, reject) => {
    (async() => {

      const allMessages = await getAllMessagesFromDb();

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

export const deleteMessageFromDb = (id) => {
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

export const getAllMessagesFromDb = () => {

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
