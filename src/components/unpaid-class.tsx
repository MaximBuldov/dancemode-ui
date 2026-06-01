import { Button, Checkbox, Col, Row, Space, Tag, Typography } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { CLASS_TIME_FORMAT, IKeys, IProduct } from 'models';
import { productService } from 'services';
import { cartStore, userStore } from 'stores';

interface UnpaidClassProps {
  product: IProduct;
  isExpired: boolean;
}

export const UnpaidClass = observer(
  ({ product, isExpired }: UnpaidClassProps) => {
    const classTime = dayjs(product.date_time);
    const isOutOfStock = product.stock_quantity === 0;
    const isInWaitList = (product.wait_list || []).some(
      (u) => u.id === (userStore.data?.id ?? -1)
    );

    const client = useQueryClient();
    const { mutate, isPending } = useMutation({
      mutationFn: () => productService.joinWaitList(product.id),
      onSuccess: (data) => {
        client.setQueryData(
          [IKeys.PRODUCTS, { month: classTime.format('YYYY-MM') }],
          (items: IProduct[] | undefined) =>
            items?.map((el) => (el.id === data.id ? data : el))
        );
      }
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
              {product.name}: {classTime.format(CLASS_TIME_FORMAT)} -{' '}
              <b>${product.price}</b>
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
