import uniqid from "uniqid";
import _ from "lodash";
import {fetch} from "whatwg-fetch";
import deepCopy from "../Helpers/copyStateHelper";

import calcComplete from "../Helpers/calcComplete";

import PouchDB from "pouchdb";
import {
  databasePath,
  serverPath,
  dbDefaultSettings,
  MSG_STORE,
  MSG_TYPE_STORE,
  PLANNING_PHASE,
  ADJUDICATION_PHASE,
  MAX_LISTENERS,
} from "../consts";

import {
  setWargameMessages,
  setCurrentWargame,
  setWargameFeedback,
} from "../ActionsAndReducers/playerUi/playerUi_ActionCreators";

import moment from "moment";

var wargameDbStore = [];

const changesListener = ({db, name, dispatch}) => {

  db.changes({since: 'now', live: true, timeout: false, heartbeat: false})
    .on('change', function () {
      (async () => {
        let messages = await getAllMessages(name);
        let latestWargame = messages.find((message) => message.infoType);
        dispatch(setCurrentWargame(latestWargame));
        dispatch(setWargameMessages(messages));
        const feedbackMessages = messages.filter((message) => message.hasOwnProperty('feedback'));
        dispatch(setWargameFeedback(feedbackMessages));
      })();
    })
    .on('error', function (err) {
      console.log(err);
      changesListener({db, name, dispatch});
    });
};


export const listenForWargameChanges = (name, dispatch) => {
  let wargame = wargameDbStore.find((item) => item.name === name);
  let db = wargame.db;
  changesListener({db, name, dispatch});
};


export const populateWargame = (dispatch) => {
  return fetch(serverPath+'allDbs')
    .then((response) => {
      return response.json();
    })
    .then((dbs) => {
      const wargameNames = wargameDbStore.map((db) => db.name);
      let toCreate = _.difference(dbs, wargameNames);
      toCreate = _.pull(toCreate, MSG_STORE, MSG_TYPE_STORE, "_replicator", "_users");

      toCreate.forEach((name) => {
        const db = new PouchDB(databasePath+name);
        db.setMaxListeners(MAX_LISTENERS);

        wargameDbStore.unshift({name, db});
      });

      const promises = wargameDbStore.map((game) => {
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

export const deleteWargame = (wargamePath) => {

  const name = getNameFromPath(wargamePath);

  let wargame = wargameDbStore.find((item) => item.name === name);
  wargame.db.destroy();
  // .then(() => {
  //   return fetch(serverPath+'deleteDb?db='+name);
  // })
  // .then((res) => {
  //   console.log(res);
  // })
  // .catch((err) => {
  //   console.log(err);
  // });


  const index = wargameDbStore.findIndex((item) => item.name === name);
  wargameDbStore.splice(index, 1);
};

export const createWargame = (dispatch) => {
  const uniqId = uniqid.time();

  const name = `wargame-${uniqId}`;

  return new Promise((resolve, reject) => {

    const db = new PouchDB(databasePath+name);

    db.setMaxListeners(15);

    wargameDbStore.unshift({name, db});

    const settings = {...dbDefaultSettings, name: name, wargameTitle: name};

    db.put(settings)
      .then(() => {
        return db.get(settings._id);
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

export const checkIfWargameStarted = (dbName) => {
  return getAllMessages(dbName)
    .then((messages) => {
      const latestWargame = messages.find((message) => message.infoType);
      if (latestWargame) return true;
      return false;
    })
};

export const getLatestWargameRevision = (dbName) => {
  return getAllMessages(dbName)
    .then((messages) => {
      const latestWargame = messages.find((message) => message.infoType);
      if (latestWargame) return latestWargame;
      return getWargameLocalFromName(dbName);
    })
};

export const editWargame = (dbPath) => {

  const dbName = getNameFromPath(dbPath);

  return new Promise((resolve, reject) => {
    getAllMessages(dbName)
      .then((messages) => {
        const latestWargame = messages.find((message) => message.infoType);
        if (latestWargame) {
          resolve(latestWargame);
        } else {
          const db = wargameDbStore.find((db) => db.name === dbName).db;
          db.get(dbDefaultSettings._id)
            .then((res) => {
              resolve(res);
            });
        }
      })
      .catch((err) => {
        reject(err);
      })
  });
};

export const updateWargameTitle = (dbName, title) => {

  return getAllWargames()
    .then(function (games) {
      if (games.some((game) => game.title === title && getNameFromPath(game.name) !== dbName)) return 'Name already in use.';

      const db = wargameDbStore.find((db) => db.name === dbName).db;

      return new Promise((resolve, reject) => {

        db.get(dbDefaultSettings._id)
          .then((res) => {
            db.put({
              _id: dbDefaultSettings._id,
              _rev: res._rev,
              name: dbName,
              wargameTitle: title,
              data: res.data,
              gameTurn: res.gameTurn,
              phase: res.phase,
              gameDate: res.gameDate,
              gameTurnTime: res.gameTurnTime,
              realtimeTurnTime: res.realtimeTurnTime,
              timeWarning: res.timeWarning,
              turnEndTime: moment().add(res.realtimeTurnTime, 'ms').format(),
              wargameInitiated: res.wargameInitiated,
            })
              .then(() => {
                resolve(db.get(dbDefaultSettings._id));
              })
              .catch((err) => {
                reject(err);
              })
          });
      });
    })
    .catch(function (err) {
      return err;
    });
};

export const saveSettings = (dbName, data) => {

  const db = wargameDbStore.find((wargame) => dbName === wargame.name).db;

  return getLatestWargameRevision(dbName)
    .then(function (localDoc) {
      let newDoc = deepCopy(localDoc);
      newDoc.data.overview = data;
      newDoc.data.overview.complete = calcComplete(data);

      return new Promise((resolve, reject) => {
        if (newDoc.wargameInitiated) {
          resolve(createLatestWargameRevision(dbName, newDoc));
        } else {
          return db.put({
            _id: newDoc._id,
            _rev: newDoc._rev,
            name: newDoc.name,
            wargameTitle: newDoc.wargameTitle,
            data: newDoc.data,
            gameTurn: newDoc.gameTurn,
            gameDate: data.startTime,
            gameTurnTime: data.gameTurnTime,
            realtimeTurnTime: data.realtimeTurnTime,
            timeWarning: data.timeWarning,
            turnEndTime: moment().add(data.realtimeTurnTime, 'ms').format(),
            wargameInitiated: newDoc.wargameInitiated,
          })
            .then(() => {
              resolve(db.get(dbDefaultSettings._id));
            })
        }
      });
    });
};

export const saveForce = (dbName, newName, newData, oldName) => {

  const db = wargameDbStore.find((wargame) => dbName === wargame.name).db;

  return getLatestWargameRevision(dbName)
    .then(function (localDoc) {

      let newDoc = deepCopy(localDoc);

      let updatedData = newDoc.data;

      let forces = updatedData.forces.forces;

      let forceNew = forces.every((force) => force.name !== oldName);

      if (forceNew) {
        forces.push({...newData, name: newName});
      } else {
        let forceIndex = forces.findIndex((force) => force.name === oldName);
        // forces.forceName = newName;
        forces.splice(forceIndex, 1, {...newData, name: newName});
      }

      updatedData.forces.forces = forces;

      // remove default before calc

      let forceCheck = deepCopy(forces);
      let umpireIndex = forceCheck.findIndex((force) => force.umpire);
      forceCheck.splice(umpireIndex, 1);

      updatedData.forces.complete = calcComplete(forceCheck);

      return new Promise((resolve, reject) => {

        getLatestWargameRevision(dbName)
          .then((res) => {

            let data = res;
            data.data = updatedData;

            if (res.wargameInitiated) {
              resolve(createLatestWargameRevision(dbName, data));
            } else {
              db.put({
                _id: dbDefaultSettings._id,
                _rev: res._rev,
                name: res.name,
                wargameTitle: res.wargameTitle,
                data: updatedData,
                gameTurn: res.gameTurn,
                phase: res.phase,
                gameDate: res.gameDate,
                gameTurnTime: res.gameTurnTime,
                realtimeTurnTime: res.realtimeTurnTime,
                timeWarning: res.timeWarning,
                turnEndTime: moment().add(res.realtimeTurnTime, 'ms').format(),
                wargameInitiated: res.wargameInitiated,
              })
                .then(() => {
                  resolve(db.get(dbDefaultSettings._id));
                })
                .catch((err) => {
                  reject(err);
                })
            }
          });
      });
    });
};



export const saveChannel = (dbName, newName, newData, oldName) => {

  const db = wargameDbStore.find((wargame) => dbName === wargame.name).db;

  return getLatestWargameRevision(dbName)
    .then(function (localDoc) {

      let newDoc = deepCopy(localDoc);

      let updatedData = newDoc.data;

      let channels = updatedData.channels.channels;

      let channelNew = channels.every((channel) => channel.name !== oldName);

      if (channelNew) {
        channels.push({...newData, name: newName});
      } else {
        let channelIndex = channels.findIndex((channel) => channel.name === oldName);
        channels.splice(channelIndex, 1, {...newData, name: newName});
      }

      updatedData.channels.channels = channels;
      updatedData.channels.complete = calcComplete(channels);

      return new Promise((resolve, reject) => {

        // db.get(dbDefaultSettings._id)
        getLatestWargameRevision(dbName)
          .then((res) => {
            if (res.wargameInitiated) {
              let data = res;
              data.data = updatedData;
              createLatestWargameRevision(dbName, data)
                .then((res) => {
                  resolve(res);
                })
            } else {
              db.put({
                _id: dbDefaultSettings._id,
                _rev: res._rev,
                name: res.name,
                wargameTitle: res.wargameTitle,
                data: updatedData,
                gameTurn: res.gameTurn,
                phase: res.phase,
                gameDate: res.gameDate,
                gameTurnTime: res.gameTurnTime,
                realtimeTurnTime: res.realtimeTurnTime,
                timeWarning: res.timeWarning,
                turnEndTime: moment().add(res.realtimeTurnTime, 'ms').format(),
                wargameInitiated: res.wargameInitiated,
              })
                .then(() => {
                  resolve(db.get(dbDefaultSettings._id));
                })
                .catch((err) => {
                  reject(err);
                })
            }
          });
      });
    })
};

export const duplicateChannel = (dbName, channelUniqid) => {

  const db = wargameDbStore.find((wargame) => dbName === wargame.name).db;

  return getLatestWargameRevision(dbName)
    .then(function (localDoc) {

      let newDoc = deepCopy(localDoc);

      let updatedData = newDoc.data;

      let channels = updatedData.channels.channels;

      let channelIndex = channels.findIndex((channel) => channel.uniqid === channelUniqid);

      let duplicateChannel = deepCopy(channels[channelIndex]);

      let uniq = uniqid.time();

      duplicateChannel.name = duplicateChannel.name + `-${uniq}`;
      duplicateChannel.uniqid = `channel-${uniq}`;

      channels.splice(channelIndex, 0, duplicateChannel);

      updatedData.channels.channels = channels;
      updatedData.channels.complete = calcComplete(channels) && channels.length !== 0;

      return new Promise((resolve, reject) => {

        getLatestWargameRevision(dbName)
          .then((res) => {
            if (res.wargameInitiated) {
              let data = res;
              data.data = updatedData;
              createLatestWargameRevision(dbName, data)
                .then((res) => {
                  resolve(res);
                })
            } else {
              db.put({
                _id: dbDefaultSettings._id,
                _rev: res._rev,
                name: res.name,
                wargameTitle: res.wargameTitle,
                data: updatedData,
                gameTurn: res.gameTurn,
                phase: res.phase,
                gameDate: res.gameDate,
                gameTurnTime: res.gameTurnTime,
                realtimeTurnTime: res.realtimeTurnTime,
                timeWarning: res.timeWarning,
                turnEndTime: moment().add(res.realtimeTurnTime, 'ms').format(),
                wargameInitiated: res.wargameInitiated,
              })
                .then(() => {
                  resolve(db.get(dbDefaultSettings._id));
                })
                .catch((err) => {
                  reject(err);
                })
            }
          });
      });
    });
};

export const deleteChannel = (dbName, channelUniqid) => {

  const db = wargameDbStore.find((wargame) => dbName === wargame.name).db;
  //
  return getLatestWargameRevision(dbName)
    .then(function (localDoc) {

      let newDoc = deepCopy(localDoc);

      let updatedData = newDoc.data;

      let channels = updatedData.channels.channels;

      let channelIndex = channels.findIndex((channel) => channel.uniqid === channelUniqid);

      channels.splice(channelIndex, 1);

      updatedData.channels.channels = channels;
      updatedData.channels.complete = calcComplete(channels) && channels.length !== 0;

      return new Promise((resolve, reject) => {

        getLatestWargameRevision(dbName)
          .then((res) => {
            if (res.wargameInitiated) {
              let data = res;
              data.data = updatedData;
              createLatestWargameRevision(dbName, data)
                .then((res) => {
                  resolve(res);
                })
            } else {
              db.put({
                _id: dbDefaultSettings._id,
                _rev: res._rev,
                name: res.name,
                wargameTitle: res.wargameTitle,
                data: updatedData,
                gameTurn: res.gameTurn,
                phase: res.phase,
                gameDate: res.gameDate,
                gameTurnTime: res.gameTurnTime,
                realtimeTurnTime: res.realtimeTurnTime,
                timeWarning: res.timeWarning,
                turnEndTime: moment().add(res.realtimeTurnTime, 'ms').format(),
                wargameInitiated: res.wargameInitiated,
              })
                .then(() => {
                  resolve(db.get(dbDefaultSettings._id));
                })
                .catch((err) => {
                  reject(err);
                })
            }
          });
      });
    })
};

export const deleteForce = (dbName, forceName) => {

  const db = wargameDbStore.find((wargame) => dbName === wargame.name).db;
  //
  return getLatestWargameRevision(dbName)
    .then(function (localDoc) {

      let newDoc = deepCopy(localDoc);

      let updatedData = newDoc.data;

      let forces = updatedData.forces.forces;

      let forceIndex = forces.findIndex((force) => force.name === forceName);

      forces.splice(forceIndex, 1);

      updatedData.forces.forces = forces;
      updatedData.channels.complete = calcComplete(forces);

      return new Promise((resolve, reject) => {

        getLatestWargameRevision(dbName)
          .then((res) => {
            if (res.wargameInitiated) {
              let data = res;
              data.data = updatedData;
              createLatestWargameRevision(dbName, data)
                .then((res) => {
                  resolve(res);
                })
            } else {
              db.put({
                _id: dbDefaultSettings._id,
                _rev: res._rev,
                name: res.name,
                wargameTitle: res.wargameTitle,
                data: updatedData,
                gameTurn: res.gameTurn,
                phase: res.phase,
                gameDate: res.gameDate,
                gameTurnTime: res.gameTurnTime,
                realtimeTurnTime: res.realtimeTurnTime,
                timeWarning: res.timeWarning,
                turnEndTime: moment().add(res.realtimeTurnTime, 'ms').format(),
                wargameInitiated: res.wargameInitiated,
              })
                .then(() => {
                  resolve(db.get(dbDefaultSettings._id));
                })
                .catch((err) => {
                  reject(err);
                })
            }
          });
      });
    })
};


export const duplicateWargame = (dbPath) => {

  const dbName = getNameFromPath(dbPath);

  const db = wargameDbStore.find((db) => db.name === dbName).db;
  const uniqId = uniqid.time();

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
          data: res.data,
          gameTurn: res.gameTurn,
          phase: res.phase,
          gameDate: res.gameDate,
          gameTurnTime: res.gameTurnTime,
          realtimeTurnTime: res.realtimeTurnTime,
          timeWarning: res.timeWarning,
          turnEndTime: moment().add(res.realtimeTurnTime, 'ms').format(),
          wargameInitiated: res.wargameInitiated,
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

export const getWargameLocalFromName = (dbName) => {

  const game = wargameDbStore.find((wargame) => dbName === wargame.name);

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

export const getWargame = (gamePath) => {

  return (async () => {

    const name = getNameFromPath(gamePath);

    const wargame = await getLatestWargameRevision(name);

    return wargame;

  })();
};

export const initiateGame = (dbName) => {

  const game = wargameDbStore.find((wargame) => dbName === wargame.name);

  return new Promise((resolve, reject) => {

    return game.db.get(dbDefaultSettings._id)

      .then((res) => {
        return game.db.put({
          _id: dbDefaultSettings._id,
          _rev: res._rev,
          name: res.name,
          wargameTitle: res.wargameTitle,
          data: res.data,
          gameTurn: res.gameTurn,
          phase: PLANNING_PHASE,
          gameDate: res.gameDate,
          gameTurnTime: res.gameTurnTime,
          realtimeTurnTime: res.realtimeTurnTime,
          timeWarning: res.timeWarning,
          turnEndTime: moment().add(res.realtimeTurnTime, 'ms').format(),
          wargameInitiated: true,
        })
      })
      .then(() => {
        return game.db.get(dbDefaultSettings._id)
      })
      .then((res) => {
        return game.db.put({
          _id: new Date().toISOString(),
          infoType: true,
          name: res.name,
          wargameTitle: res.wargameTitle,
          data: res.data,
          gameTurn: res.gameTurn,
          phase: res.phase,
          gameDate: res.gameDate,
          gameTurnTime: res.gameTurnTime,
          realtimeTurnTime: res.realtimeTurnTime,
          timeWarning: res.timeWarning,
          turnEndTime: moment().add(res.realtimeTurnTime, 'ms').format(),
          wargameInitiated: res.wargameInitiated,
        })
      })
      .then(() => {
        return game.db.get(dbDefaultSettings._id)
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      })
  })
};

export const createLatestWargameRevision = (dbName, wargameData) => {

  let copiedData = deepCopy(wargameData);
  delete copiedData._id;
  delete copiedData._rev;

  const game = wargameDbStore.find((wargame) => dbName === wargame.name);

  return new Promise((resolve, reject) => {
    game.db.put({
      _id: new Date().toISOString(),
      infoType: true,
      ...copiedData,
    })
      .then((res) => {
        resolve(getLatestWargameRevision(dbName));
      })
      .catch((err) => {
        reject(err);
        throw new Error(err);
      })
  });
};

export const getAllWargameRevisions = (dbName) => {

  return new Promise((resolve, reject) => {
    getAllMessages(dbName)
      .then((messages) => {
        let revisions = messages.filter((message) => message.hasOwnProperty('infoType'));
        resolve(revisions);
      })
      .catch((err) => {
        reject(err);
      })
  });
};

export const nextGameTurn = (dbName) => {

  return new Promise((resolve, reject) => {
    getLatestWargameRevision(dbName)
      .then((res) => {
        console.log('latest got');
        let phase = res.phase;

        switch (phase) {
          case PLANNING_PHASE:
            res.phase = ADJUDICATION_PHASE;
            res.turnEndTime = 0;
            break;
          case ADJUDICATION_PHASE:
            res.phase = PLANNING_PHASE;
            res.gameTurn += 1;
            res.gameDate = moment(res.gameDate).add(res.gameTurnTime, 'ms').format("YYYY-MM-DDTHH:mm");
            res.turnEndTime = moment().add(res.realtimeTurnTime, 'ms').format();
            break;
          default:
            break;
        }
        return createLatestWargameRevision(dbName, res);
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      })
  });
};

export const postFeedback = (dbName, playerInfo, message) => {

  const db = wargameDbStore.find((db) => db.name === dbName).db;

  return new Promise((resolve, reject) => {
    db.put({
      _id: new Date().toISOString(),
      playerInfo,
      message,
      feedback: true,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      })
  });
};

export const postNewMessage = (dbName, details, message) => {

  const db = wargameDbStore.find((db) => db.name === dbName).db;

  return new Promise((resolve, reject) => {

    db.put({
      _id: new Date().toISOString(),
      details,
      message,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      })
  });
};

export const getAllMessages = (dbName) => {

  const db = wargameDbStore.find((db) => db.name === dbName).db;

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


export const getAllWargames = function () {

  const promises = wargameDbStore.map((game) => {
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

const getNameFromPath = function (dbPath) {
  let path = new URL(dbPath).pathname;
  let index = path.lastIndexOf('/');
  return path.substring(index + 1);
};
