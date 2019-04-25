var express = require('express');
var router = express.Router();

router.use(express.json());

var messageTypes = require('../Databases/messageTypesDbs');

router.post('/create', function(req, res, next) {

  messageTypes.addMessageType(req.body)
    .then((dbRes) => {
      res.status(200).send(dbRes);
    })
    .catch((err) => {
      res.status(500).send({err});
    });
});

router.get('/getAll', function (req, res, next) {

  messageTypes.getAllMessages()
    .then((dbRes) => {
      res.status(200).send(dbRes);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post('/duplicate', function (req, res, next) {

  messageTypes.duplicateMessage(req.body.id)
    .then((dbRes) => {
      res.status(200).send(dbRes);
    })
    .catch((err) => {
      res.status(500).send(err);
    })
});

router.post('/update', function (req, res, next) {

  messageTypes.updateMessage(req.body.id, req.body.schema)
    .then((dbRes) => {
      res.status(200).send(dbRes);
    })
    .catch((err) => {
      res.status(500).send({err});
    })
});

router.post('/delete', function (req, res, next) {

  messageTypes.deleteMessage(req.body.id)
    .then((dbRes) => {
      res.status(200).send(dbRes);
    })
    .catch((err) => {
      res.status(500).send(err);
    })
});

module.exports = router;
