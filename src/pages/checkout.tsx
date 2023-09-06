import { Elements } from '@stripe/react-stripe-js';
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { CheckoutForm } from 'components';
import { IKeys } from 'models';
import React, { useState } from 'react';
import { orderService } from 'services';
import { cartStore } from 'stores';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '');

export const Checkout = () => {
  const [clientSecret, setClientSecret] = useState('');

  const stripe = useQuery({
    queryFn: () => orderService.stripe({ total: cartStore.total - cartStore.couponsTotal }),
    queryKey: [IKeys.STRIPE],
    onSuccess: (data) => setClientSecret(data as string)
  });

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe'
    }
  };

  return (
    <Spin spinning={stripe.isLoading}>
      {stripe.isSuccess && (
        <Elements options={options as StripeElementsOptions} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </Spin>
  );
};