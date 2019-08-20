import PouchDB from "pouchdb";
import {
  databasePath,
  SERGE_INFO,
  defaultGameInfo, serverPath
} from "../consts";

const LOCAL_DOC = "_local/settings";

var db = new PouchDB(databasePath+SERGE_INFO);


db.get(LOCAL_DOC)
  .then(() => {})
  .catch((err) => {
    if (err.status === 404) {
      db.put({
        _id: LOCAL_DOC,
        ...defaultGameInfo,
      });
    }
  });

export const getGameInformation = () => {
  return db.get(LOCAL_DOC)
    .then((res) => {
      delete res._id;
      delete res._rev;
      return res;
    });
};

export const saveGameInformation = ({title, description, imageUrl}) => {

  return new Promise((resolve, reject) => {

    db.get(LOCAL_DOC)
      .then((res) => {
        return db.put({
          _id: res._id,
          _rev: res._rev,
          title: title !== undefined ? title : res.title,
          description: description !== undefined ? description : res.description,
          imageUrl: imageUrl !== undefined ? new URL(imageUrl).pathname : res.imageUrl,
        });
      })
      .then(() => {
        return db.get(LOCAL_DOC);
      })
      .then((res) => {
        delete res._id;
        delete res._rev;
        resolve(res);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      })
  });
};

export const saveLogo = (file) => {
  return new Promise((resolve, reject) => {
    let fr = new FileReader();
    fr.onload = e => {
      if(e.target.result) {
        resolve({path: e.target.result});
      }
      else {
        reject(e.target.error);
      }
    };
    fr.readAsDataURL(file);
  });
};
