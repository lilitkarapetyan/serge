var express = require('express');
var router = express.Router();

router.use(express.json());

var messages = require('../Databases/messagesDbs');

router.post('/create', function(req, res, next) {

  messages.createMessage(req.body.message, req.body.schema)
    .then((dbRes) => {
      res.status(200).send(dbRes);
    })
    .catch((err) => {
      res.status(500).send({err});
    });
});

router.post('/get', function (req, res) {

  messages.getMessage(req.body.id)
    .then((dbRes) => {
      res.status(200).send(dbRes);
    })
    .catch((err) => {
      res.status(500).send({err});
    });
});

router.post('/duplicate', function (req, res) {

  messages.duplicateMessage(req.body.id)
    .then((dbRes) => {
      res.status(200).send(dbRes);
    })
    .catch((err) => {
      res.status(500).send({err});
    });
});

router.post('/update', function (req, res) {

  messages.updateMessage(req.body.id, req.body.message)
    .then((dbRes) => {
      res.status(200).send(dbRes);
    })
    .catch((err) => {
      res.status(500).send({err});
    });
});

router.post('/delete', function (req, res) {

  messages.deleteMessage(req.body.id)
    .then((dbRes) => {
      res.status(200).send(dbRes);
    })
    .catch((err) => {
      res.status(500).send({err});
    });
});

router.get('/getAll', function (req, res) {

  messages.getAllMessages()
    .then((dbRes) => {
      res.status(200).send(dbRes);
    })
    .catch((err) => {
      res.status(500).send({err});
    });
});

module.exports = router;
