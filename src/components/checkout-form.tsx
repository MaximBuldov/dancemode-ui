import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';
import { StripePaymentElementOptions } from '@stripe/stripe-js';
import { App, Button, Divider } from 'antd';
import { useCreateOrder } from 'hooks';
import { IPaymentMethod } from 'models';
import { FormEvent, useState } from 'react';
import { cartStore, userStore } from 'stores';

import { useNavigate } from 'react-router-dom';
import { SuccessPage } from './success-page';

interface CheckoutFormProps {
  paymentIntentId: string;
}

export const CheckoutForm = ({ paymentIntentId }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { message } = App.useApp();
  const [stripeError, setStripeError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const order = useCreateOrder({
    paymentIntentId,
    payment_method: IPaymentMethod.STRIPE
  });

  const errorMessage = (text?: string) => {
    setLoading(false);
    message.error(text);
    navigate('/');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!stripe || !elements || !cartStore.count) {
      errorMessage('Stripe, elements, or cart is not properly initialized.');
      return;
    }

    try {
      const res = await elements.submit();
      if (res.error) {
        message.error(res.error.message);
        setLoading(false);
        return;
      }

      const orderRes = await order.mutateAsync();
      if (orderRes.id) {
        const paymentResult = await stripe.confirmPayment({
          elements,
          redirect: 'if_required'
        });

        if (paymentResult.error) {
          errorMessage(paymentResult.error.message);
        } else {
          message.success('Payment successful!');
          setLoading(false);
          setStripeError(true);
          cartStore.clear();
        }
      } else {
        errorMessage('Order creation failed.');
      }
    } catch (error: any) {
      errorMessage(error.message || 'An error occurred.');
    }
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
        loading={loading || order.isPending}
        type="primary"
        block
        size="large"
      >
        Pay now
      </Button>
    </form>
  );
};
