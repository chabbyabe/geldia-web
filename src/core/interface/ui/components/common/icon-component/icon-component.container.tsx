import React from "react";
import { IconType } from "@interface/presenters/constants";
import IconComponentView from "./icon-component.view";

export interface IIconComponentContainer {
  children?: React.ReactNode
  formik: any
  iconType: IconType
}

export const IconComponentContainer: React.FC<IIconComponentContainer> = (props) => {
  return <IconComponentView
    children={props.children}
    formik={props.formik}
    iconType={props.iconType}
  />;
};
