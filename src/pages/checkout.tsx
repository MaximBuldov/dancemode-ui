import { Elements } from '@stripe/react-stripe-js';
import React, { useMemo } from 'react';
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from 'antd';
import { CheckoutForm } from 'components';
import { IKeys } from 'models';
import { orderService } from 'services';
import { cartStore, userStore } from 'stores';
import { useCreateOrder, useError } from 'hooks';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '');

export const Checkout = () => {
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

  const order = useCreateOrder({ paymentIntentId: stripe.data.paymentIntentId, onErrorFn });

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