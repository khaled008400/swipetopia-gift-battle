
import { adminApi } from "@/services/api";
import { Product, AdminProduct } from "@/types/product.types";

// Service methods for seller-specific functionality
const SellerService = {
  // Get products for the current seller
  getSellerProducts: async (): Promise<AdminProduct[]> => {
    try {
      // In a real application, this would be an API call
      // const response = await adminApi.get("/seller/products");
      // return response.data;
      
      // Mock implementation
      return [
        {
          id: "product-1",
          name: "Summer T-shirt",
          price: 29.99,
          description: "Comfortable cotton t-shirt perfect for summer.",
          image_url: "/products/tshirt.jpg",
          category: "Clothing",
          inventory_count: 45,
          status: "active",
          seller_id: "seller-123",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_featured: true
        },
        {
          id: "product-2",
          name: "Wireless Headphones",
          price: 99.99,
          description: "High-quality wireless headphones with noise cancellation.",
          image_url: "/products/headphones.jpg",
          category: "Electronics",
          inventory_count: 20,
          status: "active",
          seller_id: "seller-123",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_featured: false
        },
      ];
    } catch (error) {
      console.error("Error fetching seller products:", error);
      throw error;
    }
  },

  // Create a new product for the seller
  createProduct: async (productData: Partial<Product>): Promise<AdminProduct> => {
    try {
      // In a real application, this would be an API call
      // const response = await adminApi.post("/seller/products", productData);
      // return response.data;
      
      // Mock implementation
      const newProduct: AdminProduct = {
        id: Date.now().toString(),
        name: productData.name || "Untitled Product",
        price: productData.price || 0,
        description: productData.description || "",
        image_url: productData.image_url || "/placeholder.png",
        category: productData.category || "Other",
        inventory_count: 0,
        status: "draft",
        seller_id: "seller-123",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_featured: false
      };
      
      return newProduct;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // Update an existing product
  updateProduct: async (productId: string, productData: Partial<Product>): Promise<AdminProduct> => {
    try {
      // In a real application, this would be an API call
      // const response = await adminApi.put(`/seller/products/${productId}`, productData);
      // return response.data;
      
      // Mock implementation
      const updatedProduct: AdminProduct = {
        id: productId,
        name: productData.name || "Untitled Product",
        price: productData.price || 0,
        description: productData.description || "",
        image_url: productData.image_url || "/placeholder.png",
        category: productData.category || "Other",
        inventory_count: 10,
        status: productData.status || "active",
        seller_id: "seller-123",
        created_at: productData.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_featured: productData.is_featured || false
      };
      
      return updatedProduct;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  // Delete a product
  deleteProduct: async (productId: string): Promise<boolean> => {
    try {
      // In a real application, this would be an API call
      // await adminApi.delete(`/seller/products/${productId}`);
      
      // Mock implementation
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },
};

export default SellerService;
