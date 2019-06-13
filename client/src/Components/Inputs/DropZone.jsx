import React, {useCallback} from 'react';
import { connect } from "react-redux";
import "../../scss/App.scss";
import {useDropzone} from "react-dropzone";
import {addNotification} from "../../ActionsAndReducers/Notification/Notification_ActionCreators";
import {saveIcon} from "../../ActionsAndReducers/dbWargames/wargames_ActionCreators";
import {modalAction} from "../../ActionsAndReducers/Modal/Modal_ActionCreators";
import {setTabUnsaved} from "../../ActionsAndReducers/dbWargames/wargames_ActionCreators";

import {faFileUpload} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


function DropZone(props) {
  const onDropAccepted = useCallback(acceptedFiles => {

      props.imageUploaded(acceptedFiles[0]);

  }, []);

  const onDropRejected = (rejected) => {
    props.dropRejected();
  };

  const {getRootProps, getInputProps} = useDropzone({
    onDropAccepted,
    accept: "image/png",
    maxSize: 20000,
    multiple: false,
    onDropRejected,
  });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      <FontAwesomeIcon icon={faFileUpload} size="3x" />
      <p>Drag and drop a png  icon, or click to select. 20kb limit.</p>
    </div>
  )
}

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => {
  return {
    dropRejected: () => {
      dispatch(addNotification("Icon not accepted.", "warning"));
    },
    imageUploaded: (file) => {
      dispatch(saveIcon(file));
      dispatch(addNotification("Icon successfully uploaded.", "success"));
      dispatch(modalAction.close());
      dispatch(setTabUnsaved());
    },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(DropZone);
