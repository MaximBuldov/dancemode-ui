import { observer } from 'mobx-react-lite';
import { IProduct } from 'models';
import { userStore } from 'stores';

import { PaidClass } from './paid-class';
import { UnpaidClass } from './unpaid-class';
import { TeacherClass } from './teacher-class';

interface SingleClassProps {
  product: IProduct;
  isExpired: boolean;
  isPaid: boolean;
  price: number;
}

export const SingleClass = observer(({ isPaid, price, ...rest }: SingleClassProps) => {
  if (userStore.isAdmin) {
    return <TeacherClass {...rest} />;
  }
  return (isPaid) ?
    <PaidClass price={price} {...rest} /> :
    <UnpaidClass {...rest} />;
});
