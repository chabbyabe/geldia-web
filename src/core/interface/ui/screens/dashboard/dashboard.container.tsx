import { useState } from 'react';

export interface IDashboardContainerViewModel {
  children?: React.ReactNode
}

export const DashboardContainer: React.FC<IDashboardContainerViewModel> = (props) => {
  const [open, setOpen] = useState(false);

  return <DashboardView
    children={props.children}
    showModal={open}
  />
}