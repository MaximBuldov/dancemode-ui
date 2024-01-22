import { Elements } from '@stripe/react-stripe-js';
import React, { useMemo } from 'react';
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { CheckoutForm } from 'components';
import { IKeys } from 'models';
import { orderService } from 'services';
import { cartStore, userStore } from 'stores';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '');

export const Checkout = () => {
  const stripe = useQuery({
    queryFn: () => orderService.stripe({
      total: (cartStore.total - cartStore.couponsTotal) * 100,
      customer_id: Number(userStore.data?.id),
      line_items: cartStore.preparedData,
      months: cartStore.orderDates
    }),
    queryKey: [IKeys.STRIPE]
  });

  const options: StripeElementsOptions = useMemo(() => ({
    clientSecret: stripe.data?.clientSecret,
    appearance: {
      theme: 'stripe'
    }
  }), [stripe.data?.clientSecret]);

  return (
    <Spin spinning={stripe.isLoading}>
      {stripe.isSuccess && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm order={stripe.data.order} />
        </Elements>
      )}
    </Spin>
  );
};