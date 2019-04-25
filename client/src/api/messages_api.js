import {fetch} from "whatwg-fetch";
import {apiPath, headers} from "./consts";

export const addMessage = (message, schema) => {
  return new Promise((resolve, reject) => {
    fetch(`${apiPath}/messages/create`, {
      method: 'POST',
      headers,
      body: JSON.stringify({message, schema})
    })
      .then((response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  })
};

export const duplicateMessageInDb = (id) => {
  return new Promise((resolve, reject) => {
    fetch(`${apiPath}/messages/duplicate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({id})
    })
      .then((response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  })
};

export const getAllMessagesFromDb = () => {
  return new Promise((resolve, reject) => {
    fetch(`${apiPath}/messages/getAll`)
      .then((response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  })
};

export const updateMessageInDb = (id, message) => {
  return new Promise((resolve, reject) => {
    fetch(`${apiPath}/messages/update`, {
      method: 'POST',
      headers,
      body: JSON.stringify({id, message})
    })
      .then((response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};

export const getMessage = (id) => {
  return new Promise((resolve, reject) => {
    fetch(`${apiPath}/messages/get`, {
      method: 'POST',
      headers,
      body: JSON.stringify({id})
    })
      .then((response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  })
};

export const deleteMessageFromDb = (id) => {
  return new Promise((resolve, reject) => {
    fetch(`${apiPath}/messages/delete`, {
      method: 'POST',
      headers,
      body: JSON.stringify({id})
    })
      .then((response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};
