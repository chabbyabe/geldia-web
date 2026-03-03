import { BaseLayoutContainer } from '@interface/ui/components/common/layouts/base-layout/base-layout.container';
import { PAGES } from '@interface/presenters/constants';

export interface ITransactionsViewModel {
  children?: React.ReactNode

}

const TransactionsView: React.FC<ITransactionsViewModel> = (props) => {

  return (
    <BaseLayoutContainer currentPage={PAGES.TRANSACTIONS.label}>

    </BaseLayoutContainer>
  )
}

export default TransactionsView