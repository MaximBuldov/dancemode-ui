import { Elements } from '@stripe/react-stripe-js';
import React, { useMemo } from 'react';
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Skeleton } from 'antd';
import { CheckoutForm } from 'components';
import { IKeys } from 'models';
import { orderService } from 'services';
import { cartStore, userStore } from 'stores';
import { useError } from 'hooks';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '');

export const Checkout = () => {
  // eslint-disable-next-line no-console
  console.log(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

  const { onErrorFn, contextHolder } = useError();
  const stripe = useQuery({
    queryFn: () => orderService.stripe({
      total: (cartStore.total - cartStore.couponsTotal) * 100,
      customer: userStore.data?.id
    }),
    onSuccess: () => {
      order.mutate();
    },
    onError: onErrorFn,
    queryKey: [IKeys.STRIPE]
  });

  const order = useMutation({
    mutationFn: () => orderService.create({
      customer_id: Number(userStore.data?.id),
      line_items: cartStore.preparedData,
      coupon_lines: cartStore.preparedCoupons,
      payment_method: 'stripe',
      meta_data: [{
        key: '_stripe_intent_id',
        value: stripe.data.paymentIntentId
      }, {
        key: 'date',
        value: cartStore.orderDates
      }]
    }),
    mutationKey: [IKeys.ORDERS],
    onError: onErrorFn
  });

  const options: StripeElementsOptions = useMemo(() => ({
    clientSecret: stripe.data?.clientSecret,
    appearance: {
      theme: 'stripe'
    }
  }), [stripe.data?.clientSecret]);

  return (
    <>
      {(stripe.isLoading || order.isLoading) && <Skeleton active />}
      {(stripe.isSuccess && order.isSuccess) && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm order={order.data} />
        </Elements>
      )}
      {contextHolder}
    </>
  );
};