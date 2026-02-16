import React, { useState } from 'react'
import type { MouseEvent } from "react";
import { IAccount } from '@domain/entities/account/account.entity';
import AccountModalView from './account-modal.view';
import * as Yup from "yup";
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { FormRequestError } from '@domain/entities/formModels/errors.entity';
import { IUser } from '@domain/entities/user/user.entity';
import { IFormAccount } from '@base/core/domain/entities/formModels/account-form.entity';
import IconOptions from '@interface/ui/components/common/account/account-icon.constant';
export interface IAccountModalContainer {
  children?: React.ReactNode
  account?: IAccount | undefined
  selectedAccount?: IAccount | undefined
  users: IUser[]
  handleSubmit: (values: IFormAccount) => void
  handleMainModalClose: () => void
  showModal: boolean,
  isCreate?: boolean
}

export const AccountModalContainer: React.FC<IAccountModalContainer> = (props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };


  const validationSchema = Yup.object({
    name: Yup.string().required("Account name is required"),
    color: Yup.string().required("Color is required"),
    balance: Yup.number()
      .min(0, "Balance cannot be negative")
      .required("Balance is required"),
    notes: Yup.string(),
  });

  const formik = useFormik({
    enableReinitialize: true, 
    initialValues: {
    name: props.selectedAccount?.name ??"",
    icon: props.selectedAccount?.icon ?? "Savings",
    color: props.selectedAccount?.color ?? "#006CD1",
    balance: props.selectedAccount?.balance ??0,
    countInAssets: props.selectedAccount?.countInAssets ?? false,
    isDefault: props.selectedAccount?.isDefault ?? false,
    isShared: props.selectedAccount?.isShared ?? false,
    notes: props.selectedAccount?.notes ?? "",
    user: props.selectedAccount?.user ?? undefined,
    sharedUsers: props.selectedAccount?.sharedUsers ?? [],
    sharedUserIds: props.selectedAccount?.sharedUsers?.map((user) => user.id) ?? [] as number[],
    },
    validationSchema,
    onSubmit: async (values) => {
      const isCreate = !props.selectedAccount;
      try {
        await props.handleSubmit(values);

        toast.success(
          isCreate 
            ? 'Successfully added a new account!' 
            : 'Successfully edited your account!'
        );

        formik.resetForm();
        props.handleMainModalClose();
        setAnchorEl(null);
      } catch (error) {
        if (error instanceof FormRequestError) {
          formik.setErrors(error.data);
          if ('nonFieldErrors' in error.data) {
            toast.error(error.data['nonFieldErrors'][0]);
          } else {
            toast.error(
              'Unable to ' + (isCreate ? 'create' : 'edit') + ' account.'
            );
          }
        } else {
          throw new Error(
            'Uncaught exception while ' + (isCreate ? 'creating' : 'editing') + ' account'
          );
        }
      }
    },
 });

  const colors : string[] = [
    "#006CD1",
    "#0053A3",
    "#4DA3FF",
    "#2EB872",
    "#F5A524",
    "#E5484D"
  ];

  const handleCloseModal = () => {
    props.handleMainModalClose();
    formik.resetForm();
  };

  return <AccountModalView
    children={props.children}
    handleOpen={handleOpen}
    handleClose={handleCloseModal}
    open={open}
    anchorEl={anchorEl ?? undefined} 
    formik={formik}
    users={props.users}
    colors={colors}
    iconOptions={IconOptions}
    showModal={props.showModal}
    selectedAccount={props.selectedAccount}
  />
}