import { Button, Checkbox, Col, Row, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useUpdateProduct } from 'hooks';
import { observer } from 'mobx-react-lite';
import { IKeys, IProduct, IStatus, IStockStatus } from 'models';
import { cartStore, userStore } from 'stores';

interface UnpaidClassProps {
  product: IProduct;
  isExpired: boolean;
}

export const UnpaidClass = observer(
  ({ product, isExpired }: UnpaidClassProps) => {
    const classTime = dayjs(product.date_time);
    const isOutOfStock = product.stock_status === IStockStatus.OUTOFSTOCK;
    const isInWaitList = userStore.checkUserId(product.wait_list);

    const { mutate, isPending } = useUpdateProduct({
      data: {
        field: IStatus.WAIT_LIST,
        user_id: userStore.data?.id
      },
      product_id: product.id,
      queryKey: [IKeys.PRODUCTS, { month: classTime.format('YYYY-MM') }]
    });

    return (
      <Row justify="space-between">
        <Col>
          <Space>
            <Checkbox
              disabled={isExpired || isOutOfStock}
              checked={cartStore.isInCart(product)}
              onChange={() =>
                cartStore.isInCart(product)
                  ? cartStore.remove(product)
                  : cartStore.add(product)
              }
            />
            <Typography>
              {product.name}: {classTime.format('ha')} - <b>${product.price}</b>
            </Typography>
            {isOutOfStock && <Tag color="#f50">Sold out</Tag>}
            {isOutOfStock && isInWaitList && (
              <Tag color="cyan">In wait list</Tag>
            )}
            {isOutOfStock && !isInWaitList && (
              <Button
                size="small"
                ghost
                type="primary"
                loading={isPending}
                onClick={() => mutate()}
              >
                Join wait list
              </Button>
            )}
          </Space>
        </Col>
      </Row>
    );
  }
);
