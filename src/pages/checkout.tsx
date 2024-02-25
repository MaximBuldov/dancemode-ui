import { Elements } from '@stripe/react-stripe-js';
import React, { useMemo } from 'react';
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from 'antd';
import { CheckoutForm } from 'components';
import { IKeys } from 'models';
import { orderService } from 'services';
import { cartStore, userStore } from 'stores';

const stripePromise = !userStore.isAdmin && loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '');

export const Checkout = () => {
  const { data, isPending, isSuccess } = useQuery({
    queryFn: () => orderService.stripe({
      total: (cartStore.total - cartStore.couponsTotal) * 100,
      customer: userStore.data?.id
    }),
    queryKey: [IKeys.STRIPE]
  });

  const options: StripeElementsOptions = useMemo(() => ({
    clientSecret: data?.clientSecret,
    appearance: {
      theme: 'stripe'
    }
  }), [data?.clientSecret]);

  return (
    <>
      {(isPending) && <Skeleton active />}
      {(isSuccess && stripePromise) && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm paymentIntentId={data.paymentIntentId} />
        </Elements>
      )}
    </>
  );
};