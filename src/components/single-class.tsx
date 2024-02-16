import { observer } from 'mobx-react-lite';
import { IProduct, IROrder } from 'models';
import { userStore } from 'stores';

import { PaidClass } from './paid-class';
import { UnpaidClass } from './unpaid-class';
import { TeacherClass } from './teacher-class';

interface SingleClassProps {
  product: IProduct;
  isExpired: boolean;
  order?: IROrder;
}

export const SingleClass = observer((props: SingleClassProps) => {
  if (userStore.isAdmin) {
    return <TeacherClass {...props} />;
  }

  const isPaid = userStore.checkUserId(props.product.paid);
  const isPrepaid = userStore.checkUserId(props.product.pending);

  if (isPaid || isPrepaid) {
    return <PaidClass {...props} isPaid={isPaid} isPrepaid={isPrepaid} />;
  }
  return <UnpaidClass {...props} />;
});
