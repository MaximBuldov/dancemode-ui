import { Elements } from '@stripe/react-stripe-js';
import React, { useMemo, useState } from 'react';
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { CheckoutForm } from 'components';
import { IKeys, IPaymentIntent } from 'models';
import { orderService } from 'services';
import { cartStore } from 'stores';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '');

export const Checkout = () => {
  const [intent, setIntent] = useState<IPaymentIntent | null>(null);

  const stripe = useQuery({
    queryFn: () => orderService.stripe({ total: (cartStore.total - cartStore.couponsTotal) * 100 }),
    queryKey: [IKeys.STRIPE],
    onSuccess: (data) => setIntent(data)
  });

  const options = useMemo(() => ({
    clientSecret: intent?.clientSecret,
    appearance: {
      theme: 'stripe'
    }
  }), [intent?.clientSecret]);

  return (
    <Spin spinning={stripe.isLoading}>
      {intent && (
        <Elements options={options as StripeElementsOptions} stripe={stripePromise}>
          <CheckoutForm intent={intent} />
        </Elements>
      )}
    </Spin>
  );
};