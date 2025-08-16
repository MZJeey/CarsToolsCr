// Estado inicial del carrito (desde localStorage o vacío)
export const cartInitialState = JSON.parse(localStorage.getItem("cart")) || [];

// Acciones del carrito
export const CART_ACTION = {
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  CLEAN_CART: "CLEAN_CART",
};

// Actualiza el localStorage con el estado del carrito
export const updateLocalStorage = (state) => {
  localStorage.setItem("cart", JSON.stringify(state));
};

// Calcula el subtotal de un ítem (precio con impuesto * cantidad)
const calculateSubtotal = (item) => {
  const precioConImpuesto = item.precio * (1 + (item.impuesto || 0));
  return precioConImpuesto * item.cantidad;
};

// Calcula el total del carrito sumando los subtotales
const calculateTotal = (cart) =>
  cart.reduce((acc, item) => acc + item.subtotal, 0);

// Reducer del carrito
export const cartReducer = (state, action) => {
  const { type: actionType, payload: actionPayload } = action;

  switch (actionType) {
    // Agregar un ítem al carrito
    case CART_ACTION.ADD_ITEM: {
      const { id } = actionPayload;
      const productIndex = state.findIndex((item) => item.id === id);

      if (productIndex >= 0) {
        // Si el producto ya existe, aumentamos la cantidad
        const newState = structuredClone(state);
        newState[productIndex].cantidad += 1;
        newState[productIndex].subtotal = calculateSubtotal(
          newState[productIndex]
        );
        updateLocalStorage(newState);
        return newState;
      }

      // Si no existe, lo agregamos con cantidad 1
      const newState = [
        ...state,
        {
          ...actionPayload,
          cantidad: 1,
          subtotal: calculateSubtotal({ ...actionPayload, cantidad: 1 }),
        },
      ];
      updateLocalStorage(newState);
      return newState;
    }

    // Eliminar un ítem del carrito
    case CART_ACTION.REMOVE_ITEM: {
      const { id } = actionPayload;
      const newState = state.filter((item) => item.id !== id);
      updateLocalStorage(newState);
      return newState;
    }

    // Limpiar el carrito completo
    case CART_ACTION.CLEAN_CART: {
      updateLocalStorage([]);
      return [];
    }

    default:
      return state;
  }
};

// Función para obtener el total del carrito
export const getTotal = (state) => {
  return calculateTotal(state);
};

// Función para contar la cantidad total de ítems en el carrito
export const getCountItems = (state) => {
  return state.reduce((acc, item) => acc + item.cantidad, 0);
};
