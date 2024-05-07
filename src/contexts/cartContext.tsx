import { ReactNode, createContext, useContext, useState } from 'react';

interface CartProviderProps{
    children: ReactNode;
}

interface ProductProps {
    id: string;
    name: string;
    price: string;
    image: string;
    size: string;
    color: Color;
    stock: number;
    observation?: string;
}

interface Color {
    name: string;
    imageUrl: string
}

interface CartContextData {
    cart: ProductProps[];
    removeFromCart: (productId: string) => void;
    addToCart: (product: ProductProps) => void;
    clearCart: () => void;
    setCart: React.Dispatch<React.SetStateAction<ProductProps[]>>;
}

const CartContext = createContext<CartContextData>({
    cart: [],
    clearCart: () => {},
    removeFromCart: () => {},
    addToCart: () => {},
    setCart: () => [],
});

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
    return useContext(CartContext);
};

export function CartProvider  ({children}: CartProviderProps) {
    const [cart, setCart] = useState<ProductProps[]>([]);

    const removeFromCart = (productId: string) => {
      setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };
  
    const addToCart = (product: ProductProps) => {
      setCart(prevCart => [...prevCart, product]);
    };
  
    const clearCart = () => {
      setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, setCart, removeFromCart, addToCart, clearCart}}>
            {children}
        </CartContext.Provider>
    );
}
