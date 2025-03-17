
import { FC } from 'react';

export interface ProductProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string; 
  isFavorite?: boolean;
  toggleFavorite?: (productId: string) => void;
  rating?: number;
  onToggleLike?: (id: string) => void;
  isLiked?: boolean;
}

declare const ProductCard: FC<ProductProps>;

export default ProductCard;
