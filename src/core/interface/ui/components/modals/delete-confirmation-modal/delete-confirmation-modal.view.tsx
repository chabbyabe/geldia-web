import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Formik, Form } from "formik";
import { toast } from 'react-toastify';

export interface IDeleteConfirmationModalView {
  children?: React.ReactNode
  open : boolean,
  itemName: string,
  initialValues: any,
  onClose: () => void,
  onConfirm: () => Promise<void> | void,
  validationSchema: any
}


const DeleteConfirmationModalView: React.FC<IDeleteConfirmationModalView> = (props) => {

  return (
    <>
  <Dialog open={props.open} onClose={props.onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete {props.itemName}?</DialogTitle>

      <Formik
        initialValues={props.initialValues}
        validationSchema={props.validationSchema}
        onSubmit={async (_, { setSubmitting }) => {
          try {
            await props.onConfirm();
            props.onClose();
            toast.success('Successfully deleted your account!')
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, errors, touched, handleChange, isSubmitting, isValid }) => (
          <Form>
            <DialogContent dividers>
              <Typography mb={2} color="error">
                This action cannot be undone.
              </Typography>

              <Typography variant="body2" mb={1}>
                Type <strong>DELETE</strong> to confirm:
              </Typography>

              <TextField
                fullWidth
                name="confirmation"
                value={values.confirmation}
                onChange={handleChange}
                error={touched.confirmation && Boolean(errors.confirmation)}
                autoFocus
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={props.onClose} disabled={isSubmitting}>
                Cancel
              </Button>

              <Button
                type="submit"
                color="error"
                variant="contained"
                disabled={!isValid || isSubmitting}
                startIcon={
                  isSubmitting ? <CircularProgress size={18} /> : null
                }
              >
                Delete
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
    </>
  );
};

export default DeleteConfirmationModalView;

    