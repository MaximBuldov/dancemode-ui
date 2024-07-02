import { observer } from 'mobx-react-lite';
import { IProduct, IROrder } from 'models';
import { userStore } from 'stores';

import { TeacherClass } from './teacher-class';
import { UnpaidClass } from './unpaid-class';

interface SingleClassProps {
  product: IProduct;
  isExpired: boolean;
  order?: IROrder;
}

export const SingleClass = observer((props: SingleClassProps) => {
  if (userStore.isAdmin) {
    return <TeacherClass {...props} />;
  }

  // const status = userStore.getUserProductStatus(props.product.orderStatus);
  // const isPaid = status === IOrderStatus.COMPLETED;
  // const isPrepaid = status === IOrderStatus.PROCESSING;

  // if (isPaid || isPrepaid) {
  //   return <PaidClass {...props} isPaid={isPaid} isPrepaid={isPrepaid} />;
  // }
  return <UnpaidClass {...props} />;
});
