import { FETCH_PRODUCTS, DISCOUNT_PRODUCT } from '../actions/types';


const initialState = {
  items: [],
}

export default function(state = initialState, action){
  switch(action.type){
    case FETCH_PRODUCTS:
      return {
        ...state,
        items: action.payload
      }
    case DISCOUNT_PRODUCT: {
      return {
        ...state,
        items: [
          ...state.items.slice(0, action.payload.index),
          {
            ...state.items[action.payload.index],
            discount: action.payload.discount
          },
          ...state.items.slice(action.payload.index + 1),
        ]
      }
    }
    default:
      return state;
  }
}