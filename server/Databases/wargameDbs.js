var PouchDB = require('pouchdb-core');
PouchDB.plugin(require('pouchdb-adapter-leveldb'));
require('pouchdb-all-dbs')(PouchDB);

var _ = require('lodash');
var uniqid = require('uniqid');

var consts = require("../consts");

var wargameDbStore = [];


var wargames = (function() {

  var populateDbStore = function() {
    return PouchDB.allDbs()
      .then((dbs) => {
        let wargameNames = wargameDbStore.map((db) => db.name);
        let toCreate = _.difference(dbs, wargameNames);
        toCreate = _.pull(toCreate, consts.MSG_STORE, consts.MSG_TYPE_STORE);

        toCreate.forEach((name) => {
          var db = new PouchDB(name, {adapter: 'leveldb'});
          wargameDbStore.unshift({name, db});
        });

        let promises = wargameDbStore.map((game) => {
          return game.db.get(consts.dbDefaultSettings._id)
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

  var createNewWargame = function() {

    let uniqId = uniqid.time();

    var name = `wargame-${uniqId}`;

    return new Promise((resolve, reject) => {

      var db = new PouchDB(name);

      wargameDbStore.unshift({name, db});

      let settings = {...consts.dbDefaultSettings, name: name};
      settings.wargameTitle = `${settings.wargameTitle}-${uniqId}`;

      db.put(settings)
        .then(() => {
          resolve(db.get(settings._id));
        });
    });
  };

  var updateWargame = function (dbName, data, title) {

    return getAllWargames()
      .then(function (games) {
        if (games.some((game) => game.title === title && game.name !== dbName)) return 'invalid';
        return updateLocalDoc(dbName, data, title);
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  var getActiveWargame = function () {
    return new Promise((resolve, reject) => {
      wargameDbStore[0].db.get(consts.dbDefaultSettings._id)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        })
    });
  };

  var getAllWargames = function () {

    let promises = wargameDbStore.map((game) => {
      return game.db.get(consts.dbDefaultSettings._id)
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

    var db = wargameDbStore.find((db) => db.name === dbName).db;

    return new Promise((resolve, reject) => {

      db.get(consts.dbDefaultSettings._id)
        .then((res) => {
          db.put({
            _id: consts.dbDefaultSettings._id,
            _rev: res._rev,
            name: dbName,
            wargameTitle: title,
            tabs: tabs,
          })
            .then(() => {
              resolve(db.get(consts.dbDefaultSettings._id));
            })
            .catch((err) => {
              reject(err);
            })
        });
    });
  };


  var editWargame = function (dbName) {
    return new Promise((resolve, reject) => {
      try {
        var db = wargameDbStore.find((db) => db.name === dbName).db;
        db.get(consts.dbDefaultSettings._id)
          .then((res) => {
            resolve(res);
          });
      } catch (err) {
        reject(err);
        return;
      }
    });
  };


  var duplicateWargame = function (dbName) {

    let db = wargameDbStore.find((db) => db.name === dbName).db;
    let uniqId = uniqid.time();

    return new Promise((resolve, reject) => {

      var newDb;
      var newDbName = `wargame-${uniqId}`;

      db.get(consts.dbDefaultSettings._id)
        .then((res) => {
          newDb = new PouchDB(newDbName);
          return res;
        })
        .then((res) => {
          return newDb.put({
            _id: consts.dbDefaultSettings._id,
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
          console.log(err);
        })
    });
  };

  var saveMessage = function (dbName, channel, message) {

    let db = wargameDbStore.find((db) => db.name === dbName).db;
    let uniqId = uniqid.time();

    return new Promise((resolve, reject) => {

      db.put({
        _id: uniqId,
        channel,
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

  var getAllMessages = function (dbId) {

    let db = wargameDbStore.find((db) => db.name === dbId).db;

    return new Promise((resolve, reject) => {
      return db.changes({
        since: 1,
        include_docs: true,
        descending: true,
      })
        .then(function (changes) {

          let results = changes.results.map((a) => a.doc);
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
    populateDbStore: populateDbStore,
    createNewWargame: createNewWargame,
    updateWargame: updateWargame,
    editWargame: editWargame,
    duplicateWargame: duplicateWargame,
    getActiveWargame: getActiveWargame,
    saveMessage: saveMessage,
    getAllMessages: getAllMessages,
  }
})();


module.exports = wargames;
