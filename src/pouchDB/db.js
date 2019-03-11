import PouchDB from 'pouchdb-browser';

var db = new PouchDB('messages');
// var remoteCouch = 'http://couchbase:CUe+1+2n@http://35.245.63.98:8091/messages';

window.clearDatabase = function() {
  db.destroy().then(function(res) {
    console.log('database cleared');
  });
};

/*
 * Subscribes to changes to the database and
 */
db.changes({
  since: 'now',
  live: true
}).on('change', getAllMessages);

  var opts = {live: true};
  db.replicate.to(db, opts, () => 'An Error has occurred.');
  db.replicate.from(db, opts, () => 'An Error has occurred.');

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
    .catch(function (err) { return err });
};

export function getAllMessages() {
  return new Promise((resolve, reject) => {
    db.allDocs({include_docs: true, descending: true}, function(err, doc) {
      if (err) reject('something went wrong');
      resolve(doc);
    });
  });
}