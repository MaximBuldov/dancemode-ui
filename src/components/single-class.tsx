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
  isPaid: boolean;
  isPrePaid: boolean;
  order?: IROrder;
}

export const SingleClass = observer(({ isPaid, isPrePaid, ...rest }: SingleClassProps) => {
  if (userStore.isAdmin) {
    return <TeacherClass {...rest} />;
  }
  if (isPaid) {
    return <PaidClass {...rest} />;
  }
  if (isPrePaid) {
    return <PrePaidClass {...rest} />;
  }
  return <UnpaidClass {...rest} />;
});
