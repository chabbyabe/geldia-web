import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { toast } from "react-toastify";
import { IAccount } from "@domain/entities/account/account.entity";
import TransactionsController from "@interface/ui/screens/transactions/transactions.controller";
import { FormRequestError } from "@domain/entities/formModels/errors.entity";

interface ITransactionImportModalProps {
  account: IAccount | null
  onImported: () => Promise<void> | void
}

const getImportErrorMessage = (error: unknown) => {
  if (error instanceof FormRequestError) {
    if (Array.isArray(error.data?.nonFieldErrors) && error.data.nonFieldErrors.length) {
      return String(error.data.nonFieldErrors[0])
    }

    if (typeof error.data?.detail === "string") {
      return error.data.detail
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return "Unable to import transactions."
}

export const TransactionImportModal: React.FC<ITransactionImportModalProps> = (props) => {
  const controller = useMemo(() => new TransactionsController(), []);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetState = () => {
    setOpen(false);
    setSelectedFile(null);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetState();
  };

  const handleImport = async () => {
    if (!props.account?.id || !selectedFile) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await controller.importTransactions(selectedFile, props.account.id);
      await props.onImported();

      const createdText = `${result.createdCount} transaction${result.createdCount === 1 ? "" : "s"} imported`
      const skippedText = `${result.skippedCount} duplicate${result.skippedCount === 1 ? "" : "s"} skipped`
      toast.success(`${createdText}, ${skippedText}.`)

      resetState();
    } catch (error) {
      toast.error(getImportErrorMessage(error))
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<UploadFile />}
        onClick={() => setOpen(true)}
        disabled={!props.account}
      >
        Import Transactions
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Import Transactions</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Alert severity="info">
              Upload your bank export for <strong>{props.account?.name ?? "this account"}</strong>.
              The backend will detect duplicates and skip transactions that already exist.
            </Alert>

            <Typography variant="body2" color="text.secondary">
              You can upload bank export files in CSV. At the moment, only ING Bank CSV export is supported.
            </Typography>

            <Button variant="contained" component="label">
              Choose File
              <input
                hidden
                type="file"
                accept=".csv,.txt,.tsv,.tab,text/plain,text/csv"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setSelectedFile(file);
                }}
              />
            </Button>

            <Typography variant="body2">
              {selectedFile ? selectedFile.name : "No file selected"}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
          <Button
            onClick={handleImport}
            variant="contained"
            disabled={!selectedFile || !props.account || isSubmitting}
          >
            {isSubmitting ? "Importing..." : "Import"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TransactionImportModal
