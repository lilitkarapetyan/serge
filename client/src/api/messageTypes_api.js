import {fetch} from "whatwg-fetch";
import {apiPath, headers} from "./consts";

import PouchDB from "pouchdb-core";
import { databasePath,
         MSG_STORE,
         MSG_TYPE_STORE } from "./consts";

import idb from "pouchdb-adapter-idb";
import replication from "pouchdb-replication";
import http from "pouchdb-adapter-http";

import machineryFailure from '../Schemas/machinery_failure.json';
import weatherForecast from '../Schemas/weather_forecase.json';

// import allDbs from 'pouchdb-all-dbs';
//
// allDbs(PouchDB);

PouchDB.plugin(idb);
PouchDB.plugin(replication);
PouchDB.plugin(http);


var db = new PouchDB(MSG_TYPE_STORE, {adapter: 'idb'});

PouchDB.sync(databasePath+MSG_TYPE_STORE, db, {live: true, retry: true});


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
    fetch(`${apiPath}/messageTypes/create`, {
      method: 'POST',
      headers,
      body: JSON.stringify(schema)
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

export const duplicateMessageInDb = (id) => {
  return new Promise((resolve, reject) => {
    fetch(`${apiPath}/messageTypes/duplicate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({id})
    })
      .then((response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  })
};

export const updateMessageInDb = (schema, id) => {
  return new Promise((resolve, reject) => {
    fetch(`${apiPath}/messageTypes/update`, {
      method: 'POST',
      headers,
      body: JSON.stringify({id, schema})
    })
      .then((response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  })
};

export const deleteMessageFromDb = (id) => {
  return new Promise((resolve, reject) => {
    fetch(`${apiPath}/messageTypes/delete`, {
      method: 'POST',
      headers,
      body: JSON.stringify({id})
    })
      .then((response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  })
};

export const getAllMessagesFromDb = () => {
  return new Promise((resolve, reject) => {
    fetch(`${apiPath}/messageTypes/getAll`)
      .then((response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  })
};
