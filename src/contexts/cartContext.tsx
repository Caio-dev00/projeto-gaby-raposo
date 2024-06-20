import { ReactNode, createContext, useContext, useState } from 'react';

interface CartProviderProps{
    children: ReactNode;
}

export interface AddressProps {
    rua: string;
    bairro: string;
    name: string;
    cidade: string;
    estado: string;
    cep: string;
    complemento?: string;
    numero: string; 
}

interface ProductProps {
    id: string;
    name: string;
    price: number;
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
    address: AddressProps | null;
    setAddress: React.Dispatch<React.SetStateAction<AddressProps | null>>;
    updateAddress: (newAddress: AddressProps) => void; 
}

const CartContext = createContext<CartContextData>({
    cart: [],
    clearCart: () => {},
    removeFromCart: () => {},
    addToCart: () => {},
    setCart: () => [],
    address: null,
    setAddress: () => null,
    updateAddress: () => {}
});

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
    return useContext(CartContext);
};

export function CartProvider  ({children}: CartProviderProps) {
    const [cart, setCart] = useState<ProductProps[]>([]);
    const [address, setAddress] = useState<AddressProps | null>(null);

    const removeFromCart = (productId: string) => {
      setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };
  
    const addToCart = (product: ProductProps) => {
      setCart(prevCart => [...prevCart, product]);
    };
  
    const clearCart = () => {
      setCart([]);
    };

    const updateAddress = (newAddress: AddressProps) => {
        setAddress(newAddress);
    };

    return (
        <CartContext.Provider value={{ cart, setCart, removeFromCart, addToCart, clearCart, address, setAddress, updateAddress}}>
            {children}
        </CartContext.Provider>
    );
}
