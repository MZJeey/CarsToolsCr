import * as React from "react";
import { createContext, useReducer } from "react";
import {
  cartReducer,
  cartInitialState,
  getTotal,
  getCountItems,
  CART_ACTION,
} from "../reducers/cart";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";

export const CartContext = createContext();

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
  impuestos: PropTypes.arrayOf(
    PropTypes.shape({
      IdImpuesto: PropTypes.number.isRequired,
      porcentaje: PropTypes.number.isRequired,
      nombre: PropTypes.string,
    })
  ),
};

CartProvider.defaultProps = {
  impuestos: [],
};

export function CartProvider({ children, impuestos }) {
  const [state, dispatch] = useReducer(
    (state, action) => cartReducer(state, action, impuestos),
    cartInitialState
  );

  const addItem = (producto) => {
    dispatch({
      type: CART_ACTION.ADD_ITEM,
      payload: producto,
    });
    toast.success(`${producto.nombre} fue añadido al carrito`);
  };

  const removeItem = (producto) => {
    dispatch({
      type: CART_ACTION.REMOVE_ITEM,
      payload: producto,
    });
    toast(`${producto.nombre} fue eliminado del carrito`, {
      icon: <RemoveShoppingCartIcon color="warning" />,
    });
  };

  const cleanCart = () => {
    dispatch({
      type: CART_ACTION.CLEAN_CART,
    });
    toast(`Carrito limpiado`, {
      icon: <DeleteIcon color="warning" />,
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart: state,
        addItem,
        removeItem,
        cleanCart,
        getTotal: () => getTotal(state),
        getCountItems: () => getCountItems(state),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
