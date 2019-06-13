import uniqid from "uniqid";

import PouchDB from "pouchdb";
import { databasePath,
         MSG_TYPE_STORE } from "../consts";

import machineryFailure from '../Schemas/machinery_failure.json';
import weatherForecast from '../Schemas/weather_forecase.json';
import chat from '../Schemas/chat.json';
import message from '../Schemas/message.json';
import link from '../Schemas/link.json';
import dailyIntentions from '../Schemas/DailyIntentions.json';
import stateofworld from '../Schemas/StateOfWorld.json';

var db = new PouchDB(databasePath+MSG_TYPE_STORE);

export const populateDb = () => {

  let promises = [];

    db.allDocs().then(entries => {
      if (entries.rows.length === 0) {

        var machine = {
          _id: uniqid.time(),
          lastUpdated: new Date().toISOString(),
          title: 'Machinery failure',
          details: machineryFailure,
          completed: false
        };

        promises.push(db.put(machine));

        var weather = {
          _id: uniqid.time(),
          lastUpdated: new Date().toISOString(),
          title: 'Weather forecast',
          details: weatherForecast,
          completed: false
        };

        promises.push(db.put(weather));

        var messageInput = {
          _id: uniqid.time(),
          lastUpdated: new Date().toISOString(),
          title: 'Message',
          details: message,
          completed: false
        };
        promises.push(db.put(messageInput));

        var chatInput = {
          _id: uniqid.time(),
          lastUpdated: new Date().toISOString(),
          title: 'Chat',
          details: chat,
          completed: false
        };

        promises.push(db.put(chatInput));

        var linkInput = {
          _id: uniqid.time(),
          lastUpdated: new Date().toISOString(),
          title: 'Link',
          details: link,
          completed: false
        };

        promises.push(db.put(linkInput));

        var dailyInput = {
          _id: uniqid.time(),
          lastUpdated: new Date().toISOString(),
          title: 'Daily intentions',
          details: dailyIntentions,
          completed: false
        };

        promises.push(db.put(dailyInput));

        var sowInput = {
          _id: uniqid.time(),
          lastUpdated: new Date().toISOString(),
          title: 'State of World',
          details: stateofworld,
          completed: false
        };
        promises.push(db.put(sowInput));

        Promise.all(promises).then(() => true);
      } else {
        return false;
      }
  });
};




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
    db.allDocs({include_docs: true, descending: true})
      .then((res) => {
        resolve(res.rows.map((a) => a.doc));
      })
      .catch((err) => {
        reject(err);
      });
  });
};
