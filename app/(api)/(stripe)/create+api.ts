import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, amount } = body;

  if (!name || !email || !amount) {
    return new Response(
      JSON.stringify({
        error: "Please enter all the required details.",
        status: 400,
      })
    );
  }

  let customer;

  const doesCustomerExist = await stripe.customers.list({ email });

  if (doesCustomerExist.data.length > 1) {
    customer = doesCustomerExist.data[0];
  } else {
    const newCustomer = await stripe.customers.create({ name, email });

    customer = newCustomer;
  }

  const emphericalKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2022-11-15" }
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseInt(amount) * 100,
    currency: "USD",
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
  });

  return new Response(
    JSON.stringify({
      paymentIntent: paymentIntent,
      emphericalKey: emphericalKey,
      customer: customer.id,
    })
  );
}
