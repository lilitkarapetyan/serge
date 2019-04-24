import {fetch} from "whatwg-fetch";
import {apiPath, headers} from "../pouchDB/consts";
import _ from "lodash";


export const populateWargame = () => {
  return fetch(`${apiPath}/wargames/populate`)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => console.log(err));
};

export const createWargame = () => {
  return fetch(`${apiPath}/wargames/create`, {
    method: 'POST',
    headers,
  })
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then((res) => {
      return res;
    })
    .catch((err) => console.log(err));
};

export const editWargame = (name) => {
  return fetch(`${apiPath}/wargames/edit`, {
    method: 'POST',
    headers,
    body: JSON.stringify({name})
  })
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then((res) => {
      return res;
    })
    .catch((err) => console.log(err));
};

export const updateWargame = (dbName, data, title) => {
  return fetch(`${apiPath}/wargames/update`, {
    method: 'POST',
    headers,
    body: JSON.stringify({dbName, data, title})
  })
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then((localDoc) => {
      return localDoc;
    })
    .catch((err) => console.log(err));
};

export const duplicateWargame = (dbName) => {
  return fetch(`${apiPath}/wargames/duplicate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({dbName})
    })
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then((games) => {
      return games;
    })
    .catch((err) => console.log(err));
};
