import {fetch} from "whatwg-fetch";
import {apiPath, headers} from "./consts";
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

export const getWargame = () => {
  return fetch(`${apiPath}/wargames/getActive`)
    .then((response) => {
      console.log(response.ok);
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((err) => console.log(err));
};

export const postNewMessage = (dbName, details, message) => {

  return new Promise((resolve, reject) => {
    fetch(`${apiPath}/wargames/createMessage`, {
      method: 'POST',
      headers,
      body: JSON.stringify({dbName, details, message})
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

export const getAllMessages = (id) => {
  return fetch(`${apiPath}/wargames/getMessages/wargameId/${id}`)
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
