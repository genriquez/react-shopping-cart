import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { loadCart, removeProduct } from '../../store/actions/floatCartActions';
import { updateCart } from '../../store/actions/updateCartActions';

import CartProduct from './CartProduct';

import persistentCart from "../../persistentCart";

import util from '../../util';


class FloatCart extends Component {
  
  state = {
    isOpen: false
  };

  componentWillMount() {
    this.props.loadCart( JSON.parse(persistentCart().get()) || [] );
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.updateCart(this.props.cartProducts);
    }, 0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.newProduct !== this.props.newProduct) {
      this.addProduct(nextProps.newProduct);
    }

    if (nextProps.productToRemove !== this.props.productToRemove) {
      this.removeProduct(nextProps.productToRemove);
    }
  }

  openFloatCart = () => {
    this.setState({ isOpen: true });
  }

  closeFloatCart = () => {
    this.setState({ isOpen: false });
  }

  mapItem = (item) => {
    const { products } = this.props;

    var product = products.find(p => p.id == item.productId);
    return { product, cartItem: item };
  }

  addProduct = (product) => {
    const { cartProducts, updateCart } = this.props;
    let productAlreadyInCart = false;

    cartProducts.forEach(cp => {
      if (cp.productId === product.productId) {
        cp.quantity += product.quantity;
        productAlreadyInCart = true;
      }
    });

    if (!productAlreadyInCart) {
      cartProducts.push({ productId: product.productId, quantity: 1 });
    }

    updateCart(cartProducts);
    this.openFloatCart();
  }

  removeProduct = (product) => {
    const { cartProducts, updateCart, products } = this.props;

    const index = cartProducts.findIndex(p => p.productId === product.id);
    if (index >= 0) {
      cartProducts.splice(index, 1);
      updateCart(cartProducts);
    }
  }

  proceedToCheckout = () => {
    const { totalPrice, productQuantity, currencyFormat, currencyId } = this.props.cartTotals;

    if (!productQuantity) {
      alert("Add some product in the bag!");
    }else {
      alert(`Checkout - Subtotal: ${currencyFormat} ${util.formatPrice(totalPrice, currencyId)}`);
    }
  }

  calculateTotals() {
    let { cartProducts, products } = this.props;
    cartProducts = products.length > 0 ? cartProducts.map(this.mapItem) : [];

    let productQuantity = cartProducts.reduce( (sum, p) => {
      sum += p.cartItem.quantity;
      return sum;
    }, 0);
  
    let totalPrice =  cartProducts.reduce((sum, p) => {
      sum += p.product.price * p.cartItem.quantity * (p.product.discount ? .9 : 1);
      return sum;
    }, 0);
  
    let installments =  cartProducts.reduce((greater, p) => {
      greater = p.product.installments > greater ? p.product.installments : greater;
      return greater;
    }, 0);
    
    return {
      productQuantity,
      installments,
      totalPrice,
      currencyId: 'USD',
      currencyFormat: '$',
    }
  }

  render() {
    const { cartProducts, removeProduct, products } = this.props;

    const cartItems = products.length > 0 ? cartProducts.map(ci => {
      var product = products.find(p => p.id == ci.productId);

      return (
        <CartProduct
          cartItem={ci}
          removeProduct={removeProduct}
          product={product}
          key={product.id}
        />
      );
    }) : [];

    let cartTotals = this.calculateTotals();

    let classes = ['float-cart'];

    if (!!this.state.isOpen) {
      classes.push('float-cart--open');
    }

    return (
      <div className={classes.join(' ')}>
        {/* If cart open, show close (x) button */}
        {this.state.isOpen && (
          <div
            onClick={() => this.closeFloatCart()}
            className="float-cart__close-btn"
          >
          X
          </div>
        )}

        {/* If cart is closed, show bag with quantity of product and open cart action */}
        {!this.state.isOpen && (
          <span
            onClick={() => this.openFloatCart()}
            className="bag bag--float-cart-closed"
          >
            <span className="bag__quantity">{cartTotals.productQuantity}</span>
          </span>
        )}

        <div className="float-cart__content">
          <div className="float-cart__header">
            <span className="bag">
              <span className="bag__quantity">
                {cartTotals.productQuantity}
              </span>
            </span>
            <span className="header-title">Bag</span>
          </div>

          <div className="float-cart__shelf-container">
            {cartItems}
            {!cartItems.length && (
              <p className="shelf-empty">
                Add some product in the bag <br />:)
              </p>
            )}
          </div>

          <div className="float-cart__footer">
            <div className="sub">SUBTOTAL</div>
            <div className="sub-price">
              <p className="sub-price__val">
                {`${cartTotals.currencyFormat} ${util.formatPrice(cartTotals.totalPrice, cartTotals.currencyId)}`}
              </p>
              <small className="sub-price__installment">
                {!!cartTotals.installments && (
                  <span>
                    {`OR UP TO ${cartTotals.installments} x ${cartTotals.currencyFormat} ${util.formatPrice(cartTotals.totalPrice / cartTotals.installments, cartTotals.currencyId)}`}
                  </span>
                )}
              </small>
            </div>
            <div onClick={() => this.proceedToCheckout()} className="buy-btn">
              Checkout
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FloatCart.propTypes = {
  loadCart: PropTypes.func.isRequired,
  updateCart: PropTypes.func.isRequired,
  cartProducts: PropTypes.array.isRequired,
  newProduct: PropTypes.object,
  removeProduct: PropTypes.func,
  productToRemove: PropTypes.object,
};

const mapStateToProps = state => ({
  cartProducts: state.cartProducts.items,
  newProduct: state.cartProducts.item,
  productToRemove: state.cartProducts.itemToRemove,
  products: state.products.items,
});

export default connect(mapStateToProps, { loadCart, updateCart, removeProduct})(FloatCart);

