
import { FC } from 'react';

export interface ProductProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string; 
  isFavorite?: boolean;
  toggleFavorite?: (productId: string) => void;
}

declare const ProductCard: FC<ProductProps>;

export default ProductCard;
