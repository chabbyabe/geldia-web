import React from 'react'
import { IAccount } from '@domain/entities/account/account.entity';
import { Wallet as WalletIcon} from '@mui/icons-material'; 
import IconOptions from './account-icon.constant';

export interface IAccountIconModel {
  children?: React.ReactNode
  account: IAccount
}

export const AccountIcon: React.FC<IAccountIconModel> = (props) => {

  function AccountIcon({ account }: { account: IAccount }) {
    const iconFromOptions = account.icon ? IconOptions[account.icon] : undefined;
    const iconToRender = iconFromOptions ?? <WalletIcon />;
    return React.cloneElement(iconToRender as React.ReactElement, {
      sx: { fontSize: 40, color: account.color ?? '#006CD1', mr: 1 }
    });
  }


  return <AccountIcon account={props.account} />

}

export default AccountIcon 
