import PouchDB from 'pouchdb-browser';
// import warGameSchema from "../schemas/wargame.json";
import machineryFailure from "../schemas/machinery_failure";
import weatherForecast from "../schemas/weather_forecase";
import deepCopy from "../ActionsAndReducers/copyStateHelper";
import moment from "moment";
import uniqid from "uniqid";
import {MSG_TYPE_STORE} from "./consts";

var db = new PouchDB(MSG_TYPE_STORE);


window.clearDatabase = function() {
  db.destroy().then(function(res) {
    console.log('database cleared');
  });
};


// var opts = {live: true};
// db.replicate.to(db, opts, () => 'An Error has occurred.');
// db.replicate.from(db, opts, () => 'An Error has occurred.');

/*
  for development
 */

var populateDb = function () {
  // var wargame = {
  //   _id: new Date().toISOString(),
  //   title: 'wargame schema',
  //   details: warGameSchema,
  //   completed: false
  // };
  // db.put(wargame);

  var machine = {
    _id: new Date().toISOString(),
    lastUpdated:  new Date().toISOString(),
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
      window.location.reload(true);
    });
  },1000);

};

db.allDocs().then(entries => {
  if (entries.rows.length === 0) {
    populateDb();
  }
});


/**
 * @param schema
 * @type object
 */

export function addMessageType(schema) {

  return new Promise((resolve, reject) => {
    (async() => {

      const allMessages = await getAllMessagesFromDB();

      const matchedName = allMessages.find((messageType) => messageType.title.toLowerCase() === schema.title.toLowerCase());

      if (matchedName) {
        reject("Message title already used");
        return;
      }

      const addToDB = await createAndAddNewMessageType(schema);
      resolve(addToDB);

    })();
  });
}

function createAndAddNewMessageType(schema) {
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
}


export function duplicateMessageTypeDB(id) {

  let time = new Date().toISOString();

  return new Promise((resolve, reject) => {
    db.get(id)
      .then(function (doc) {

        var updatedMessage = deepCopy(doc.details);
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
}


export function updateMessageTypeInDB(schema, id) {
  return new Promise((resolve, reject) => {
    (async() => {

      const allMessages = await getAllMessagesFromDB();
      const matchedName = allMessages.find((el) => el.title === schema.title && el._id !== id);

      if (matchedName) {
        reject("Message title already used");
        return;
      }

      const addToDB = await updateMessage(schema, id);

      resolve(addToDB);

    })();
  });
}


function updateMessage(schema, id) {
  return new Promise((resolve, reject) => {
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
  });
}


export function deleteMessageTypeDB(id) {
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
}


export function getAllMessagesFromDB() {
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
}
