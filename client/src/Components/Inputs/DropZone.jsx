import React, {useCallback} from 'react';
import { connect } from "react-redux";
import "../../scss/App.scss";
import {useDropzone} from "react-dropzone";
import {addNotification} from "../../ActionsAndReducers/Notification/Notification_ActionCreators";
import {addIcon} from "../../ActionsAndReducers/dbWargames/wargames_ActionCreators";
import {modalAction} from "../../ActionsAndReducers/Modal/Modal_ActionCreators";
import {setTabUnsaved} from "../../ActionsAndReducers/dbWargames/wargames_ActionCreators";

import {faFileUpload} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


function DropZone(props) {
  const onDrop = useCallback(acceptedFiles => {
    const reader = new FileReader();

    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = () => {
      // Do whatever you want with the file contents
      const base64 = reader.result;

      props.imageUploaded(base64);
    };

    acceptedFiles.forEach(file => reader.readAsDataURL(new Blob([file])));

  }, []);

  const onDropRejected = () => {
    props.dropRejected();
  };

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    maxSize: 20000,
    multiple: false,
    onDropRejected,
  });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      <FontAwesomeIcon icon={faFileUpload} size="3x" />
      <p>Drag and drop the icon, or click to select a file. 20kb limit.</p>
    </div>
  )
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => {
  return {
    dropRejected: () => {
      dispatch(addNotification("Image too large.", "warning"));
    },
    imageUploaded: (base64) => {
      dispatch(addIcon(base64));
      dispatch(addNotification("Icon successfully uploaded.", "success"));
      dispatch(modalAction.close());
      dispatch(setTabUnsaved());
    },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(DropZone);
