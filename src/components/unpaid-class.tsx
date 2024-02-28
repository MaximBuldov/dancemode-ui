import { Typography, Checkbox, Col, Row, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { IProduct, IStockStatus } from 'models';
import { cartStore } from 'stores';

interface UnpaidClassProps {
  product: IProduct;
  isExpired: boolean;
}

export const UnpaidClass = observer(({ product, isExpired }: UnpaidClassProps) => {
  const classTime = dayjs(product.date_time);
  const isOutOfStock = product.stock_status === IStockStatus.OUTOFSTOCK;

  return (
    <Row justify="space-between">
      <Col>
        <Space>
          <Checkbox
            // disabled={isExpired || isOutOfStock}
            checked={cartStore.isInCart(product)}
            onChange={() => cartStore.isInCart(product) ? cartStore.remove(product) : cartStore.add(product)}
          />
          <Typography>{product.name}: {classTime.format('ha')} - <b>${product.price}</b></Typography>
          {isOutOfStock && <Tag color="#f50">Sold out</Tag>}
        </Space>
      </Col>
    </Row>
  );
});