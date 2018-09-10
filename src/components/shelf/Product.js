import React from 'react';
import PropTypes from "prop-types";

import Thumb from '../Thumb';

import util from '../../util';


const Product = (props) => {
  const product = props.product;

  // Um componente de input pode alterar a quantidade no futuro
  product.quantity = 1;

  let price = product.price;
  if (product.discount) {
    price = price * .9;
  }

  let formattedOriginalPrice = util.formatPrice(product.price, product.currencyId); 
  let formattedPrice = util.formatPrice(price, product.currencyId);
  
  let productInstallment;
  
  if(!!product.installments) {
    const installmentPrice = (product.price / product.installments);

    productInstallment = (
      <div className="installment">
        <span>or {product.installments} x</span><b> {product.currencyFormat} {util.formatPrice(installmentPrice, product.currencyId)}</b>
      </div>
    );
  }

  return (
    <div className="shelf-item" data-sku={product.sku}>
      {product.isFreeShipping && 
        <div className="shelf-stopper">Free shipping</div>
      }
      <Thumb
        classes="shelf-item__thumb"
        src={require(`../../static/products/${product.sku}_1.jpg`)}
        alt={product.title}
      />
      <p className="shelf-item__title">{product.title}</p>
      <div className="shelf-item__price">
        <div className="val"><small>{product.currencyFormat}</small>
          <span style={{ textDecoration: product.discount ? "line-through" : ""}}>
            <b>
              {formattedOriginalPrice.substr(0, formattedOriginalPrice.length - 3)}
            </b>
            <span>
              {formattedOriginalPrice.substr(formattedOriginalPrice.length - 3, 3)}
            </span>
          </span>

          {product.discount &&
            <span>
              <b>
                {formattedPrice.substr(0, formattedPrice.length - 3)}
              </b>
              <span>
                {formattedPrice.substr(formattedPrice.length - 3, 3)}
              </span>
            </span>
          }
        </div>
        {productInstallment}
      </div>
      <div onClick={() => props.addProduct(product)} className="shelf-item__buy-btn">Add to cart</div>
      
      <div onClick={() => props.discountProduct(props.index, !product.discount)} className="shelf-item__buy-btn">
        {product.discount && "Remove discount" || "Discount"}
      </div>
    </div>
  );
}


Product.propTypes = {
  product: PropTypes.object.isRequired,
  addProduct: PropTypes.func.isRequired,
  discountProduct: PropTypes.func.isRequired
};

export default Product;