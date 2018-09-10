import { UPDATE_CART} from './types';

import persistentCart from '../../persistentCart';


export const updateCart = (cartProducts) => dispatch => {
  /*let productQuantity = cartProducts.reduce( (sum, p) => {
    sum += p.cartItem.quantity;
    return sum;
  }, 0);

  let totalPrice = cartProducts.reduce((sum, p) => {
    sum += p.product.price * p.cartItem.quantity * (p.product.discount ? .9 : 1);
    return sum;
  }, 0);

  let installments = cartProducts.reduce((greater, p) => {
    greater = p.product.installments > greater ? p.product.installments : greater;
    return greater;
  }, 0);
  

  let cartTotals = {
    productQuantity,
    installments,
    totalPrice,
    currencyId: 'USD',
    currencyFormat: '$',
  }*/

  persistentCart().persist(JSON.stringify(cartProducts));

  /*
  dispatch({
    type: UPDATE_CART,
    payload: cartTotals,
  });*/
}
