import { Typography } from 'antd';

interface PriceProps {
  total: number | string;
  subtotal: number | string;
}

export const Price = (props: PriceProps) => {
  const total = Number(props.total);
  const subtotal = Number(props.subtotal);
  const isSale = total !== subtotal;

  return (
    <>
      <Typography.Link
        strong={!isSale}
        delete={!!isSale}
        disabled={!!isSale}
      >
        ${subtotal}
      </Typography.Link>
      {!!isSale && (
        <Typography.Link strong style={{ marginLeft: 10 }}>
          ${total}
        </Typography.Link>
      )}
    </>
  );
};