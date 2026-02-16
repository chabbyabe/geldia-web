import React from "react";
import DeleteConfirmationModalView from "./delete-confirmation-modal.view";
import * as Yup from "yup";

interface IDeleteConfirmationModal {
  open: boolean;
  itemName: string;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

interface FormValues {
  confirmation: string;
}

const validationSchema = Yup.object({
  confirmation: Yup.string()
    .oneOf(["DELETE"], "You must type DELETE to confirm")
    .required("Required"),
});


const DeleteConfirmationModal: React.FC<IDeleteConfirmationModal> = (props) => {
  const initialValues: FormValues = {
    confirmation: "",
  };

  return (
    <DeleteConfirmationModalView
      open={props.open}
      itemName={props.itemName}
      initialValues={initialValues}
      onClose={props.onClose}
      onConfirm={props.onConfirm}
      validationSchema={validationSchema}
    />
  );
};

export default DeleteConfirmationModal;
