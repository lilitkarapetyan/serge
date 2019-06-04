This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Serge

### Zip packages 
`npm run save-modules`

### Install packages 
`npm run offline-install`

### For development
ensure line 6&7 uncommented in `client/src/api/consts.js`

change "homepage" to `http://localhost:8080/client/build` from `https://serge-dev.herokuapp.com/client/build` in `client/package.json`

`npm run start` at `/client` for local dev (as well as `npm run start` at `/`)

`npm run start` at `/` for testing heroku environment

#### to run locally
`localhost:3000` or `localhost:8080` (heroku env)

### for heroku
ensure line 6&7 commented in `client/src/api/consts.js`

change "homepage" to `https://serge-dev.herokuapp.com/client/build` from `http://localhost:8080/client/build` in `client/package.json` 

push to heroku
