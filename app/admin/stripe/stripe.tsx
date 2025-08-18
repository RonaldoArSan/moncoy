import Stripe from 'stripe';

let _stripe: Stripe | null = null;
const getStripe = (): Stripe => {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      // ...
    });
  }
  return _stripe;
};

const getCustomers = () => getStripe().customers.list();