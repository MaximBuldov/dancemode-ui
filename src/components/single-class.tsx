import { observer } from 'mobx-react-lite';
import { IMetaData, IProduct } from 'models';

import { PaidClass } from './paid-class';
import { UnpaidClass } from './unpaid-class';

interface SingleClassProps {
  product: IProduct;
  isExpired: boolean;
  order?: number;
  meta_data?: IMetaData[];
  item_id?: number;
}

export const SingleClass = observer((props: SingleClassProps) => {
  const { order, meta_data, item_id, ...rest } = props;
  return (order && meta_data && item_id) ?
    <PaidClass
      {...rest}
      order={order}
      meta_data={meta_data}
      item_id={item_id}
    /> :
    <UnpaidClass {...rest} />;
});