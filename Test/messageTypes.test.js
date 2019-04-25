process.env.NODE_ENV = 'test';
const consts = require('../consts.js');
const PouchDB = require('pouchdb-core');
PouchDB.plugin(require('pouchdb-adapter-leveldb'));
require('pouchdb-all-dbs')(PouchDB);

let messageTypes = require('../Databases/messageTypesDbs.js');

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();



chai.use(chaiHttp);
//Our parent block
describe('messageTypes', () => {
  beforeEach((done) => { //Before each test we empty the databases
    let qty;
    let count = 0;
    PouchDB.allDbs()
      .then((dbs) => {
        if (dbs.length === 0) {
          done();
        }
        qty = dbs.length;
        dbs.forEach((name) => {
          // make connection to database
          var db = new PouchDB(consts.databasePath+name, {adapter: 'leveldb'});

          db.destroy().then(() => {
            count += 1;
            console.log('destroyed');
            if (count === qty) {
              done();
            }
          })
            .catch((err) => {
              console.log(err);
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
    });

  describe('fake test', () => {
    it('it should force a test', (done) => {
      // chai.request(server)
      //   .get('/book')
      //   .end((err, res) => {
      //     res.should.have.status(200);
      //     res.body.should.be.a('array');
      //     res.body.length.should.be.eql(0);
      //     done();
      //   });
      console.log('test');
      done();
    });
  });
  });
