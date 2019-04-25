import PouchDB from "pouchdb-core";
import { databasePath,
         MSG_STORE,
         MSG_TYPE_STORE } from "../api/consts";

import idb from "pouchdb-adapter-idb";
import replication from "pouchdb-replication";
import http from "pouchdb-adapter-http";

PouchDB.plugin(idb);
PouchDB.plugin(replication);
PouchDB.plugin(http);


export const localDatabaseSubscription = function () {

  var db = new PouchDB(MSG_TYPE_STORE, {adapter: 'idb'});

  PouchDB.sync(databasePath+MSG_TYPE_STORE, db, {live: true, retry: true});

  // PouchDB.sync(db, databasePath+MSG_TYPE_STORE);

};
