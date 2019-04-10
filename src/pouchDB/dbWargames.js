import PouchDB from 'pouchdb-browser';
import {
  MSG_STORE,
  MSG_TYPE_STORE,
} from "./consts";
import _ from "lodash";

require('pouchdb-all-dbs')(PouchDB);


var wargameDbStore = [];

export function populateDbStore() {
  return PouchDB.allDbs()
    .then((dbs) => {

      let wargameNames = wargameDbStore.map((dbs) => dbs.name);
      let toCreate = _.difference(dbs, wargameNames);
      toCreate = _.pull(toCreate, MSG_STORE, MSG_TYPE_STORE);

      toCreate.forEach((name) => {
        var db = new PouchDB(name);
        wargameDbStore.push({name, db});
      });
      return wargameDbStore.map((wargame) => wargame.name);
    })
    .catch((err) => {
      console.log(err);
    });
}


export function createNewWargame(name) {
  return new Promise((resolve, reject) => {

    var db = new PouchDB(name);
    wargameDbStore.push({name, db});

  });
}


export function addToDB(dbName) {
  return new Promise((resolve, reject) => {

    (async() => {

      var db = wargameDbStore.find((db) => db.name === dbName).db;

      return db.put({
        _id: new Date().toISOString(),
        name: "message1",
        details: {}
      })
        .then(function (result) {
          resolve(result);
        })
    })();
  });
}


export function getAllWargameNames() {
  return wargameDbStore.map((wargame) => wargame.name);
}


export function fetchFromDB(dbName) {
  return new Promise((resolve, reject) => {

    try {
      var db = wargameDbStore.find((db) => db.name === dbName).db;
    } catch (err) {
      reject(err);
      return;
    }

    return db.changes({
      since: 0,
      include_docs: true,
      descending: true,
    })
      .then(function (changes) {

        let results = changes.results.map((a) => a.doc);
        console.log(results);
        results = results.filter((a) => !a.hasOwnProperty('_deleted') && a.hasOwnProperty('details'));

        resolve(results);
      })
      .catch(function (err) {
        // handle errors
        console.log(err);
        reject(err);
      });
  });
}
