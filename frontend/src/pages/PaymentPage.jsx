import React from 'react'
import CheckoutSteps from '../components/CheckOut/CheckoutSteps';
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import Payment from '../components/Payment/Payment';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// 👇 Move it here so it runs only once
const stripePromise = loadStripe("pk_test_51RzEW8K1E9rPYr3XLawII29YgBpic3IVrCIYdtlzRYZNvRfElUOF2zF02f6UyVR3BtlaDE1AWkKme9TZlJ3N5ulf001DEZcMbQ");

const PaymentPage = () => {
  return (
    <div className='w-full min-h-screen bg-[#f6f9fc]'>
      <Header />
      <br />
      <br />
      <CheckoutSteps active={2} />
      <Elements stripe={stripePromise}>
        <Payment />
      </Elements>
      <br />
      <br />
      <Footer />
    </div>
  )
}

export default PaymentPage
