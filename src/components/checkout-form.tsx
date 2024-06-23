import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';
import { StripeError, StripePaymentElementOptions } from '@stripe/stripe-js';
import { useMutation } from '@tanstack/react-query';
import { Button, Divider } from 'antd';
import { useCreateOrder, useError } from 'hooks';
import { IKeys, IPaymentMethod } from 'models';
import { FormEvent, useState } from 'react';
import { cartStore, userStore } from 'stores';

import { SuccessPage } from './success-page';

interface CheckoutFormProps {
  paymentIntentId: string;
}

export const CheckoutForm = ({ paymentIntentId }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { contextHolder, messageApi } = useError();
  const [stripeError, setStripeError] = useState(false);

  const order = useCreateOrder({
    paymentIntentId,
    onSuccess: () => payment.mutate(),
    payment_method: IPaymentMethod.STRIPE
  });

  const payment = useMutation({
    mutationFn: () =>
      stripe!.confirmPayment({
        elements: elements!,
        redirect: 'if_required'
      }),
    mutationKey: [IKeys.PAYMENTS],
    onSuccess: (data) => {
      messageApi.error(JSON.stringify(data));
      if (data.error) {
        messageApi.error(data.error.message);
      } else {
        setStripeError(true);
        cartStore.clear();
      }
    },
    onError: (error: StripeError) => {
      messageApi.error(error.message);
    }
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements || !cartStore.count) {
      return;
    }
    elements.submit().then((res) => {
      res.error ? messageApi.error(res.error.message) : order.mutate();
    });
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: 'tabs',
    defaultValues: {
      billingDetails: { email: userStore.data?.email }
    }
  };

  return stripeError && order.isSuccess ? (
    <SuccessPage order={order.data} />
  ) : (
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement id="link-authentication-element" />
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <Divider />
      <Button
        disabled={!stripe || !elements}
        htmlType="submit"
        loading={payment.isPending || order.isPending}
        type="primary"
        block
        size="large"
      >
        Pay now
      </Button>
      {contextHolder}
    </form>
  );
};
