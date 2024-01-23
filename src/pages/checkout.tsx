import { Elements } from '@stripe/react-stripe-js';
import React, { useMemo } from 'react';
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { CheckoutForm } from 'components';
import { IKeys } from 'models';
import { orderService } from 'services';
import { cartStore, userStore } from 'stores';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '');

export const Checkout = () => {
  const stripe = useQuery({
    queryFn: () => orderService.stripe({
      total: (cartStore.total - cartStore.couponsTotal) * 100
    }),
    onSuccess: () => {
      order.mutate();
    },
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
    mutationKey: [IKeys.ORDERS]
  });

  const options: StripeElementsOptions = useMemo(() => ({
    clientSecret: stripe.data?.clientSecret,
    appearance: {
      theme: 'stripe'
    }
  }), [stripe.data?.clientSecret]);

  return (
    <Spin spinning={stripe.isLoading || order.isLoading}>
      {(stripe.isSuccess && order.isSuccess) && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm order={order.data} />
        </Elements>
      )}
    </Spin>
  );
};