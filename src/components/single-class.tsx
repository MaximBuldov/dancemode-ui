import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { IROrderProduct, IProduct } from 'models';

import { PaidClass } from './paid-class';
import { UnpaidClass } from './unpaid-class';

interface SingleClassProps {
  data: IProduct;
  isExpired: boolean;
  day: dayjs.Dayjs;
  status?: IROrderProduct;
}

export const SingleClass = observer((props: SingleClassProps) => {
  const { status, ...rest } = props;
  return status ? <PaidClass {...rest} status={status} /> : <UnpaidClass {...rest} />;
});