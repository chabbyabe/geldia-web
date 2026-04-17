import React from "react";
import ColorComponentView from "./color-component.view";

export interface IColorComponentContainer {
  children?: React.ReactNode
  formik: any
}

export const ColorComponentContainer: React.FC<IColorComponentContainer> = (props) => {
  return <ColorComponentView
    children={props.children}
    formik={props.formik}

  />;
};
