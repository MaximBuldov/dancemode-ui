import { observer } from 'mobx-react-lite';
import { IMetaData, IProduct } from 'models';
import { userStore } from 'stores';

import { PaidClass } from './paid-class';
import { UnpaidClass } from './unpaid-class';
import { TeacherClass } from './teacher-class';

interface SingleClassProps {
  product: IProduct;
  isExpired: boolean;
  order?: number;
  meta_data?: IMetaData[];
  item_id?: number;
}

export const SingleClass = observer(({ order, meta_data, item_id, ...rest }: SingleClassProps) => {
  if (userStore.isAdmin) {
    return <TeacherClass {...rest} />;
  }
  return (order && meta_data && item_id) ?
    <PaidClass
      {...rest}
      order={order}
      meta_data={meta_data}
      item_id={item_id}
    /> :
    <UnpaidClass {...rest} />;
});
