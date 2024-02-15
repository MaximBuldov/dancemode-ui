import { observer } from 'mobx-react-lite';
import { IProduct, IROrder } from 'models';
import { userStore } from 'stores';

import { PaidClass } from './paid-class';
import { UnpaidClass } from './unpaid-class';
import { TeacherClass } from './teacher-class';
import { PrePaidClass } from './pre-paid-class';

interface SingleClassProps {
  product: IProduct;
  isExpired: boolean;
  order?: IROrder;
}

export const SingleClass = observer((props: SingleClassProps) => {
  if (userStore.isAdmin) {
    return <TeacherClass {...props} />;
  }
  const userId = Number(userStore.data?.id);
  const paid = props.product.paid;
  const pending = props.product.pending;
  const isPaid = Array.isArray(paid) && paid.includes(userId);
  const isPrePaid = Array.isArray(pending) && pending.includes(userId);
  if (isPaid) {
    return <PaidClass {...props} />;
  }
  if (isPrePaid) {
    return <PrePaidClass {...props} />;
  }
  return <UnpaidClass {...props} />;
});
