import {fetch} from "whatwg-fetch";
import {apiPath, headers} from "../pouchDB/consts";

export const postNewMessage = (schema) => {

  return new Promise((resolve, reject) => {
    fetch(`${apiPath}/messageTypes/create`, {
      method: 'POST',
      headers,
      body: JSON.stringify(schema)
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

export const duplicateMessageInDb = (id) => {
  return new Promise((resolve, reject) => {
    fetch(`${apiPath}/messageTypes/duplicate`, {
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

export const updateMessageInDb = (schema, id) => {
  return new Promise((resolve, reject) => {
    fetch(`${apiPath}/messageTypes/update`, {
      method: 'POST',
      headers,
      body: JSON.stringify({id, schema})
    })
      .then((response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  })
};

export const deleteMessageFromDb = (id) => {
  return new Promise((resolve, reject) => {
    fetch(`${apiPath}/messageTypes/delete`, {
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
    fetch(`${apiPath}/messageTypes/getAll`)
      .then((response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  })
};
