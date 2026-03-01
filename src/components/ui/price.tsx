import { Typography } from 'antd';

interface PriceProps {
  total: number | string;
  subtotal: number | string;
}

export const Price = (props: PriceProps) => {
  const total = Number(props.total);
  const subtotal = Number(props.subtotal);
  const isSale = total !== 0;

  return (
    <>
      <Typography.Link strong={!isSale} delete={!!isSale} disabled={!!isSale}>
        ${Math.round(subtotal / 10) * 10}
      </Typography.Link>
      {!!isSale && (
        <Typography.Link strong style={{ marginLeft: 10 }}>
          ${Math.round(total * 10) / 10}
        </Typography.Link>
      )}
    </>
  );
};
