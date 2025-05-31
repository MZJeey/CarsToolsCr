import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe utilizarse con el CartProvider');
  }
  return context;
};



