import { ReactNode, createContext, useContext, useState } from 'react';
import { ImageItemProps } from '../pages/dashboard/new';

interface CartProviderProps{
    children: ReactNode;
}

interface Color {
    imageUrl: string;
    name: string;
}

interface ProductProps {
    id: string,
    name: string,
    size: string;
    image: ImageItemProps[];
    price: number,
    colorImage: Color[],
    quantidade: string,
    observation?: string
    selectedColorIndex?: number,
    selectedColorName: string ,
    variation: string
}

interface CartContextData {
    cart: ProductProps[];
    setCart: React.Dispatch<React.SetStateAction<ProductProps[]>>;
    addToCart: (product: ProductProps, selectedColorIndex?: number, selectedColorName?: string) => void;
    removeFromCart: (productId: string, variation: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextData>({
    cart: [],
    setCart: () => [],
    addToCart: () => {},
    removeFromCart: () => {},
    clearCart: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
    return useContext(CartContext);
};

export function CartProvider  ({children}: CartProviderProps) {
    const [cart, setCart] = useState<ProductProps[]>([]);

    const addToCart = (product: ProductProps, selectedColorIndex?: number, selectedColorName?: string) => {
        const newProduct = { ...product };
        if (selectedColorIndex !== undefined) {
            newProduct.selectedColorIndex = selectedColorIndex;
        }
        if (selectedColorName) {
            newProduct.selectedColorName = selectedColorName;
        }
        setCart([...cart, newProduct]);
    };

    const removeFromCart = (productId: string, variation: string) => {
        setCart(cart.filter(item => item.id !== productId || item.variation !== variation));
      };
      

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}
