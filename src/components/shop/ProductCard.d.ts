
import { FC } from 'react';

export interface ProductProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  isLiked?: boolean;
  onToggleLike?: () => void;
}

declare const ProductCard: FC<ProductProps>;

export default ProductCard;
