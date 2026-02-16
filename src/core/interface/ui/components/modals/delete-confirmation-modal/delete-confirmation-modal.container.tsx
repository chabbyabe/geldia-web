import React from "react";
import DeleteConfirmationModalView, { TInitialValues } from "./delete-confirmation-modal.view";
import pluralize from "pluralize";

interface IDeleteConfirmationModal {
  open: boolean
  pageTitle: string
  hasConfirmation: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
}

const DeleteConfirmationModal: React.FC<IDeleteConfirmationModal> = (props) => {
  const initialValues : TInitialValues = { 
    hasConfirmation: props.hasConfirmation, 
    pageTitle: pluralize.singular(props.pageTitle),
    confirmation: "",
  };
  return (
    <DeleteConfirmationModalView
      open={props.open}
      pageTitle={props.pageTitle}
      initialValues={initialValues}
      onClose={props.onClose}
      onConfirm={props.onConfirm}
    />
  );
};

export default DeleteConfirmationModal;
