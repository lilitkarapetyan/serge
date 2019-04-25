var express = require('express');
var router = express.Router();

router.use(express.json());

var wargames = require('../Databases/wargameDbs');

router.get('/populate', function(req, res, next) {

  wargames.populateDbStore()
    .then((dbRes) => {
      res.status(200).send(dbRes);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post('/create', function(req, res, next) {
  wargames.createNewWargame()
    .then((dbRes) => {
      res.status(200).send(dbRes);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post('/edit', function(req, res, next) {
  wargames.editWargame(req.body.name)
    .then((dbRes) => {
      res.status(200).send(dbRes);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post('/update', function(req, res, next) {

  var dbName = req.body.dbName;
  var data = req.body.data;
  var title = req.body.title;

  wargames.updateWargame(dbName, data, title)
    .then((dbRes) => {
      res.status(200).send(dbRes);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});


router.post('/duplicate', function (req, res, next) {

  wargames.duplicateWargame(req.body.dbName)
    .then((dbRes) => {
      res.status(200).send(dbRes);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get('/getActive', function (req, res) {

  wargames.getActiveWargame()
    .then((dbRes) => {
      res.status(200).send(dbRes);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post('/createMessage', function (req, res) {

  wargames.saveMessage(req.body.dbName, req.body.channel, req.body.force, req.body.message)
    .then((dbRes) => {
      res.status(200).send(dbRes);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get('/getMessages/wargameId/:wargameId', function (req, res) {

  const id = req.params.wargameId;

  wargames.getAllMessages(id)
    .then((dbRes) => {
      res.status(200).send(dbRes);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;
