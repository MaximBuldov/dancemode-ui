import React, { FormEvent, useState } from 'react';
import { LinkAuthenticationElement, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeError, StripePaymentElementOptions } from '@stripe/stripe-js';
import { useMutation } from '@tanstack/react-query';
import { Button, Divider, message } from 'antd';
import { IKeys, IPaymentIntent } from 'models';
import { cartStore, userStore } from 'stores';
import { orderService } from 'services';

import { SuccessPage } from './success-page';

interface CheckoutFormProps {
  intent: IPaymentIntent
}

export const CheckoutForm = ({ intent }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [messageApi, contextHolder] = message.useMessage();
  const [successPage, showSuccessPage] = useState(false);

  const payment = useMutation({
    mutationFn: () => stripe!.confirmPayment({
      elements: elements!,
      redirect: 'if_required'
    }),
    mutationKey: [IKeys.PAYMENTS],
    onSuccess: () => cartStore.clear(),
    onError: (error: StripeError) => {
      messageApi.error(error.message);
    }
  });

  const order = useMutation({
    mutationFn: () => orderService.create({
      customer_id: Number(userStore.data?.id),
      line_items: cartStore.preparedData,
      meta_data: [{
        key: '_stripe_intent_id',
        value: intent!.paymentIntentId
      }, {
        key: 'date',
        value: cartStore.orderDates
      }]
    }),
    mutationKey: [IKeys.ORDERS],
    onSuccess: () => {
      payment.mutate();
      showSuccessPage(true);
    }
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements || !cartStore.count) {
      return;
    }

    order.mutate();
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: 'tabs',
    defaultValues: {
      billingDetails: { email: userStore.data?.email }
    }
  };

  return successPage ? (
    <SuccessPage />
  ) : (
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement id="link-authentication-element" />
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <Divider />
      <Button
        disabled={!stripe || !elements}
        htmlType="submit"
        loading={payment.isLoading || order.isLoading}
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