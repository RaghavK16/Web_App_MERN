import React, { useState, useEffect } from 'react';
import { isAuthenticated } from '../auth/helper';
import { cartEmpty } from './helper/CartHelper';
import { Link } from 'react-router-dom';
import StripeCheckoutButton from 'react-stripe-checkout';
import { API } from '../backend';
import { createOrder } from './helper/orderHelper';

const StripeCheckout = ({
    products,
    setReload=f=>f,
    reload=undefined
}) => {

  const [data, setData] = useState({
      loading: false,
      success: false,
      error: "",
      address: ""
  });

  const token=isAuthenticated() && isAuthenticated().token;
  const userId=isAuthenticated() && isAuthenticated().user._id;

  const getFinalAmount = () => {
      let amount=0;
      products.map(p => {
          amount = amount + p.price;
      });
      return amount;
  };

  const makePayment = (token) => {
      const body={
          token,
          products
      }
      const headers={
          "Content-Type": "application/json"
      }
      return fetch(`${API}/stripepayment`, {
          method: "POST",
          headers,
          body: JSON.stringify(body)
      }).then(response => {

          //call further methods for emptying cart after purchase
          const {status} = response;
          console.log("STATUS ", status);

          cartEmpty(() => {
              console.log("CRASH??");
          });

          setReload(!reload);

      }).catch(error => console.log(error));
  };

  const showStripeButton = () => {
      return (
        isAuthenticated() ? 
        (
        <StripeCheckoutButton
        stripeKey="pk_test_Hhm5ckpq7w0rI9HpharMxg7Z00Js0VqkdK"
        token={makePayment}
        amount={getFinalAmount()*100}
        name="Buy Tshirts"
        shippingAddress
        billingAddress
        >
            <button className="btn btn-outline-success">Pay With Stripe</button>
        </StripeCheckoutButton>
        ) : 
        ( 
        <Link to="/signin">
            <button className="btn btn-outline-danger">Sign In</button>
        </Link> 
        )
      );
  };

    return (
        <div>
            <h3 className="text-white">Stripe Checkout Amount: $ {getFinalAmount()} </h3>
            {showStripeButton()}
        </div>
    );
};

export default StripeCheckout;