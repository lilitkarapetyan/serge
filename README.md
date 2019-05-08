This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Serge

### Zip packages 
`npm run save-modules`

### Install packages 
`npm run offline-install`

### For development
ensure line 3&4 uncommented in `client/src/api/consts.js`

`npm run start` at `/client` for local dev (as well as `npm run dev` at `/`)

`npm run start` at `/` for testing heroku environment

### for heroku
ensure line 3&4 commented in `client/src/api/consts.js`

change "homepage" to `https://serge-dev.herokuapp.com/client/build` from `http://localhost:8080/client/build` in `client/package.json`

`npm run start` from `/` 

#### to run locally
`localhost:3000` or `localhost:8080`

