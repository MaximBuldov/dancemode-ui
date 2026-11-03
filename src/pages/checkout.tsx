import { Elements } from '@stripe/react-stripe-js';
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from 'antd';
import { CheckoutForm } from 'components';
import { IKeys } from 'models';
import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import * as routes from 'routes/consts';
import { orderService } from 'services';
import { cartStore, userStore } from 'stores';

const stripePromise =
  !userStore.isAdmin &&
  loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

// Stripe rejects payments under 50 cents
const MIN_CARD_TOTAL = 0.5;

export const Checkout = () => {
  // Checked once on open: the cart is cleared after a successful payment
  const [canPay] = useState(
    () => cartStore.count > 0 && cartStore.total >= MIN_CARD_TOTAL
  );
  const { data, isPending, isSuccess } = useQuery({
    queryFn: () => orderService.stripe(cartStore.total),
    queryKey: [IKeys.STRIPE],
    enabled: canPay
  });

  const options: StripeElementsOptions = useMemo(
    () => ({
      clientSecret: data?.clientSecret,
      appearance: {
        theme: 'stripe'
      }
    }),
    [data?.clientSecret]
  );

  if (!canPay) return <Navigate to={routes.CART} replace />;

  return (
    <>
      {isPending && <Skeleton active />}
      {isSuccess && stripePromise && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm paymentIntentId={data.paymentIntentId} />
        </Elements>
      )}
    </>
  );
};
