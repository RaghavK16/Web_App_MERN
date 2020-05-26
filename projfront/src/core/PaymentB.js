import React, { useState, useEffect } from 'react';
import { isAuthenticated } from '../auth/helper';
import { cartEmpty, loadCart } from './helper/CartHelper';
import { Link } from 'react-router-dom';
import { DropIn } from 'braintree-web-drop-in-react';
import { API } from '../backend';
import { createOrder } from './helper/orderHelper';
import { getmeToken, processPayment } from './helper/paymentbhelper';

const PaymentB = ({
    products, 
    setReload = f => f,
    reload=undefined
}) => {

    const [info, setInfo] = useState({
        loading: false,
        success: false,
        clientToken: null,
        error: "",
        instance: {}
    });

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    const getToken = (userId, token) => {
        getmeToken(userId, token)
        .then(info => {
            console.log(info);
            if(info.error) {
                setInfo({...info, error: info.error})
            }
            else {
                const clientToken=info.clientToken;
                setInfo({clientToken})
            }
        });
    };

    const showbtdropIn = () => {
        return (
            <div>
                {
                info.clientToken !== null && products.length > 0
                ? (
                    <div>
                        <DropIn
                        options={{authorization: info.clientToken}}
                        onInstance={instance => (info.instance=instance)}
                        />
                        <button onClick={() => {}}>Buy</button>
                    </div>
                ) 
                : (<h3>Login / Add to Cart</h3>)
                }
            </div>
        )
    }

    useEffect(() => {
        getToken(userId, token)
    })

    return (
        <div>
            <h3>Braintree Payment</h3>
            {showbtdropIn()}
        </div>
    );
};

export default PaymentB;