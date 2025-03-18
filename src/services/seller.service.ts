
import { supabase } from "@/lib/supabase";
import { Product, AdminProduct } from "@/types/product.types";

class SellerService {
  async getSellerProducts(): Promise<AdminProduct[]> {
    // This is a mock implementation
    const mockProducts: AdminProduct[] = [
      {
        id: "1",
        name: "Wireless Earbuds",
        price: 79.99,
        description: "High-quality wireless earbuds with noise cancellation",
        image_url: "/assets/products/earbuds.jpg",
        inventory_count: 120,
        category: "Electronics",
        status: "active",
        seller_id: "seller-123",
        created_at: "2023-04-15T10:30:00Z",
        updated_at: "2023-05-20T14:45:00Z",
        is_featured: true
      },
      {
        id: "2",
        name: "Smart Watch",
        price: 149.99,
        description: "Feature-rich smartwatch with health monitoring",
        image_url: "/assets/products/smartwatch.jpg",
        inventory_count: 85,
        category: "Electronics",
        status: "active",
        seller_id: "seller-123",
        created_at: "2023-03-10T09:15:00Z",
        updated_at: "2023-05-18T11:20:00Z",
        is_featured: true
      }
    ];
    
    return mockProducts;
  }

  async createProduct(productData: Partial<Product>): Promise<AdminProduct> {
    // Mock implementation
    const newProduct: AdminProduct = {
      id: Date.now().toString(),
      name: productData.name || "New Product",
      price: productData.price || 0,
      description: productData.description || "",
      image_url: productData.image_url || "/assets/products/default.jpg",
      inventory_count: productData.inventory_count || 0,
      category: productData.category || "Other",
      status: "draft",
      seller_id: "seller-123",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_featured: false
    };
    
    return newProduct;
  }

  async updateProduct(productId: string, productData: Partial<Product>): Promise<AdminProduct> {
    // Mock implementation
    const updatedProduct: AdminProduct = {
      id: productId,
      name: productData.name || "Updated Product",
      price: productData.price || 0,
      description: productData.description || "",
      image_url: productData.image_url || "/assets/products/default.jpg",
      inventory_count: productData.inventory_count || 0,
      category: productData.category || "Other",
      status: productData.status as 'active' | 'draft' | 'unavailable' || "active",
      seller_id: "seller-123",
      created_at: "2023-03-10T09:15:00Z",
      updated_at: new Date().toISOString(),
      is_featured: productData.is_featured || false
    };
    
    return updatedProduct;
  }

  async deleteProduct(productId: string): Promise<boolean> {
    // Mock implementation
    return true;
  }

  async searchProducts(query: string): Promise<AdminProduct[]> {
    // Mock implementation that filters products by name
    const allProducts = await this.getSellerProducts();
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export default new SellerService();
