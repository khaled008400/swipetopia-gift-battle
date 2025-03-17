
import { FC } from 'react';
import { Product } from '@/types/product.types';

export interface ProductProps {
  product: Product;
  onLike?: (productId: string) => void;
  onAddToCart?: (product: Product) => void;
  isLiked?: boolean;
}

declare const ProductCard: FC<ProductProps>;

export default ProductCard;
