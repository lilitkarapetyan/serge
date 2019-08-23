const express = require('express');
const cors = require('cors');
const path = require('path');
const opn = require('opn');
const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname)));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port);

console.log('App is listening on port ' + port);
opn(`http://localhost:${port}/serge/admin`);
