import PouchDB from 'pouchdb-browser';
import warGameSchema from "../schemas/wargame.json";
import machineryFailure from "../schemas/machinery_failure";
import weatherForecast from "../schemas/weather_forecase";

var db = new PouchDB('messageTypes');
// var remoteCouch = 'http://couchbase:CUe+1+2n@http://35.245.63.98:8091/messages';


window.clearDatabase = function() {
  db.destroy().then(function(res) {
    console.log('database cleared');
  });
};

/*
 * Subscribes to changes to the database, increase max listeners from 10, create db.
 */
db.setMaxListeners(15);
db.changes({
  since: 'now',
  live: true
}).on('change', getAllMessages);

var opts = {live: true};
db.replicate.to(db, opts, () => 'An Error has occurred.');
db.replicate.from(db, opts, () => 'An Error has occurred.');

/*
  for development
 */

var populateDb = function () {
  var wargame = {
    _id: new Date().toISOString(),
    title: 'wargame schema',
    details: warGameSchema,
    completed: false
  };
  db.put(wargame);

  setTimeout(function () {
    var machine = {
      _id: new Date().toISOString(),
      title: 'machinery failure',
      details: machineryFailure,
      completed: false
    };
    db.put(machine);
  },1000);

  setTimeout(function () {
    var weather = {
      _id: new Date().toISOString(),
      title: 'weather forecast',
      details: weatherForecast,
      completed: false
    };
    db.put(weather).then(() => {
      console.log('DATA BASE COMPLETE');
      window.location.reload(true);
    });
  },2000);

};

db.allDocs().then(entries => {
  if (entries.rows.length === 0) {
    populateDb();
  }
});


/**
 * @param message
 * @type object
 */
export function addMessage(messageObj) {
  var message = {
    _id: new Date().toISOString(),
    details: messageObj,
    completed: false
  };
  return db.put(message)
    .then(function(res) { return res })
};

export function getAllMessages() {
  return new Promise((resolve, reject) => {
    db.allDocs({include_docs: true, descending: true}, function(err, doc) {
      if (err) reject('something went wrong');
      resolve(doc);
    });
  });
}