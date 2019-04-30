import uniqid from "uniqid";
import _ from "lodash";
import {fetch} from "whatwg-fetch";

import PouchDB from "pouchdb";
import {  databasePath,
          serverPath,
          dbDefaultSettings,
          MSG_STORE,
          MSG_TYPE_STORE } from "./consts";

import {setWargameMessages} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";


var wargameDbStore = [];


const changesListener = (db, name, dispatch) => {
  db.changes({since: 'now', live: true, timeout: false, heartbeat: false})
    .on('change', function () {
      (async () => {
        let messages = await getAllMessages(name);
        dispatch(setWargameMessages(messages));
      })();
    })
    .on('error', function (err) {
      console.log(err);
      changesListener(db, name, dispatch);
    });
};

export const populateWargame = (dispatch) => {
  return fetch(serverPath+'allDbs')
    .then((response) => {
      return response.json();
    })
    .then((dbs) => {
      let wargameNames = wargameDbStore.map((db) => db.name);
      let toCreate = _.difference(dbs, wargameNames);
      toCreate = _.pull(toCreate, MSG_STORE, MSG_TYPE_STORE, "_replicator", "_users");

      toCreate.forEach((name) => {
        var db = new PouchDB(databasePath+name);
            db.setMaxListeners(11);

            changesListener(db, name, dispatch);

        wargameDbStore.unshift({name, db});
      });

      let promises = wargameDbStore.map((game) => {
        return game.db.get(dbDefaultSettings._id)
          .then(function (res) {
            return {
              name: game.db.name,
              title: res.wargameTitle
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
      return Promise.all(promises);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const clearWargames = () => {
  fetch(serverPath+'clearAll')
    .then(() => {
      window.location.reload(true);
    });
};

export const createWargame = () => {
  let uniqId = uniqid.time();

  var name = `wargame-${uniqId}`;

  return new Promise((resolve, reject) => {

    var db = new PouchDB(databasePath+name);

    wargameDbStore.unshift({name, db});

    let settings = {...dbDefaultSettings, name: name};
    settings.wargameTitle = `${settings.wargameTitle}-${uniqId}`;

    db.put(settings)
      .then(() => {
        resolve(db.get(settings._id));
      });
  });
};

export const editWargame = (dbPath) => {

  let dbName = getNameFromPath(dbPath);

  return new Promise((resolve, reject) => {
    try {
      var db = wargameDbStore.find((db) => db.name === dbName).db;
      db.get(dbDefaultSettings._id)
        .then((res) => {
          resolve(res);
        });
    } catch (err) {
      reject(err);
    }
  });
};

export const updateWargame = (dbName, data, title) => {

  return getAllWargames()
    .then(function (games) {
      if (games.some((game) => game.title === title && getNameFromPath(game.name) !== dbName)) return 'invalid';
      return updateLocalDoc(dbName, data, title);
    })
    .catch(function (err) {
      return err;
    });
};

export const duplicateWargame = (dbPath) => {

  let dbName = getNameFromPath(dbPath);

  let db = wargameDbStore.find((db) => db.name === dbName).db;
  let uniqId = uniqid.time();

  return new Promise((resolve, reject) => {

    var newDb;
    var newDbName = `wargame-${uniqId}`;

    db.get(dbDefaultSettings._id)
      .then((res) => {
        newDb = new PouchDB(databasePath+newDbName);
        return res;
      })
      .then((res) => {
        return newDb.put({
          _id: dbDefaultSettings._id,
          name: newDbName,
          wargameTitle: `${res.wargameTitle}-${uniqId}`,
          tabs: res.tabs,
        })
          .then(() => {
            return res;
          })
      })
      .then(() => {
        wargameDbStore.unshift({name: newDbName, db: newDb});
        return getAllWargames();
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
        console.log(err);
      })
  });
};

export const getWargame = (gamePath) => {

  let name = getNameFromPath(gamePath);

  let game = wargameDbStore.find((wargame) => name === wargame.name);

  console.log(game);

  return new Promise((resolve, reject) => {
    game.db.get(dbDefaultSettings._id)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      })
  });
};

export const postNewMessage = (dbName, details, message) => {

  let db = wargameDbStore.find((db) => db.name === dbName).db;

  return new Promise((resolve, reject) => {

    db.put({
      _id: new Date().toISOString(),
      details,
      message,
    })
      .then((res) => {
        console.log(res);
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
      })
  });
};

export const getAllMessages = (dbName) => {

  let db = wargameDbStore.find((db) => db.name === dbName).db;

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

export var getAllWargames = function () {

  let promises = wargameDbStore.map((game) => {
    return game.db.get(dbDefaultSettings._id)
      .then(function (res) {
        return {
          name: game.db.name,
          title: res.wargameTitle
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
  return Promise.all(promises);
};

var updateLocalDoc = function(dbName, tabs, title) {

  console.log(dbName);

  var db = wargameDbStore.find((db) => db.name === dbName).db;

  return new Promise((resolve, reject) => {

    db.get(dbDefaultSettings._id)
      .then((res) => {
        db.put({
          _id: dbDefaultSettings._id,
          _rev: res._rev,
          name: dbName,
          wargameTitle: title,
          tabs: tabs,
        })
          .then(() => {
            resolve(db.get(dbDefaultSettings._id));
          })
          .catch((err) => {
            reject(err);
          })
      });
  });
};

var getNameFromPath = function (dbPath) {
  let path = new URL(dbPath).pathname;
  let index = path.lastIndexOf('/');
  return path.substring(index + 1);
};
