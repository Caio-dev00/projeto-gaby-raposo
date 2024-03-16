import React, { useState } from 'react';
import photo from '../../assets/logo.png'

interface ProductSwitcherProps {
  initialColor?: string; // Cor inicial do produto
}

const ProductSwitcher: React.FC<ProductSwitcherProps> = ({ initialColor = 'red' }) => {
  const [selectedColor, setSelectedColor] = useState<string>(initialColor);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };


    const getProductImage = (color: string): string => {
        switch (color) {
          case 'red':
            return photo;
          case 'blue':
            return '../../assets/logo.png';
          case 'green':
            return '../../assets/logo.png';
          default:
            return 'default_product_image.jpg';
        }
    };
  

  return (
    <div>
      <h2>Product Color Switcher</h2>
      <div>
      <button className='w-4 h-4' type="button" onClick={() => handleColorChange('red')} style={{ backgroundColor: 'red' }}></button>
        <button className='w-4 h-4' type="button" onClick={() => handleColorChange('blue')} style={{ backgroundColor: 'blue' }}></button>
        <button className='w-4 h-4' type="button" onClick={() => handleColorChange('green')} style={{ backgroundColor: 'green' }}></button>
        {/* Adicione mais botões de cores conforme necessário */}
      </div>
      <div>
        <img src={getProductImage(selectedColor)} alt={`Product in ${selectedColor}`} />
      </div>
    </div>
  );
};

export default ProductSwitcher;