import React, { useState, useEffect } from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import "../styles.css";
import {API} from "../backend";
import Base from './Base';
import Card from './Card';
import { getProducts } from './helper/coreapicalls';

const Home = () => {

  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);

  const loadAllProduct = () => {
    getProducts().then(data => {
      if(data.error) {
        setError(data.error);
      }
      else {
        setProducts(data);
      }
    });
  };

  useEffect(() => {
    loadAllProduct();
  }, []);


  return(
    <Base title="Home" description="Welcome to the store !!">
      <div className="row text-center text-white">

        <h1 className="text-center text-white">
          All T-Shirts !!
        </h1>
        <div className="row">
          {products.map((product, index) => {
            return (
              <div key={index} className="col-4 mb-4">
                <Card product={product} />
              </div>
            )
          })}
        </div>
      </div>
    </Base>
  );

};

export default Home;