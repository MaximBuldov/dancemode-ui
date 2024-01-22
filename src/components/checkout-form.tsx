import React, { FormEvent } from 'react';
import { LinkAuthenticationElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeError, StripePaymentElementOptions } from '@stripe/stripe-js';
import { useMutation } from '@tanstack/react-query';
import { Button, Divider, message } from 'antd';
import { IKeys, IROrder } from 'models';
import { cartStore, userStore } from 'stores';

import { SuccessPage } from './success-page';

interface CheckoutFormProps {
  order: IROrder
}

export const CheckoutForm = ({ order }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [messageApi, contextHolder] = message.useMessage();

  const payment = useMutation({
    mutationFn: () => stripe!.confirmPayment({
      elements: elements!,
      redirect: 'if_required'
    }),
    mutationKey: [IKeys.PAYMENTS],
    onSuccess: () => {
      cartStore.clear();
    },
    onError: (error: StripeError) => {
      messageApi.error(error.message);
    }
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements || !cartStore.count) {
      return;
    }

    payment.mutate();
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: 'tabs',
    defaultValues: {
      billingDetails: { email: userStore.data?.email }
    }
  };

  return payment.isSuccess ? (
    <SuccessPage order={order} />
  ) : (
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement id="link-authentication-element" />
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <Divider />
      <Button
        disabled={!stripe || !elements}
        htmlType="submit"
        loading={payment.isLoading}
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