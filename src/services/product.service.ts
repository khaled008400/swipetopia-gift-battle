
import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product.types";

class ProductService {
  async getTopProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('view_count', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Product[];
    } catch (error) {
      console.error('Error fetching top products:', error);
      return [];
    }
  }

  async getProductAnalytics(): Promise<any> {
    try {
      // In a real app, this would fetch actual analytics data
      // For now, return mock data
      return {
        totalSales: 15650,
        totalViews: 28940,
        conversionRate: 4.2,
        categories: [
          { name: 'Electronics', sales: 5200, views: 9800 },
          { name: 'Clothing', sales: 4300, views: 7500 },
          { name: 'Books', sales: 2100, views: 4200 },
          { name: 'Home', sales: 3050, views: 5800 },
          { name: 'Beauty', sales: 1000, views: 1640 }
        ],
        monthlyData: [
          { month: 'Jan', sales: 980, views: 1800 },
          { month: 'Feb', sales: 1050, views: 1950 },
          { month: 'Mar', sales: 1200, views: 2200 },
          { month: 'Apr', sales: 1350, views: 2400 },
          { month: 'May', sales: 1500, views: 2650 },
          { month: 'Jun', sales: 1680, views: 3000 }
        ]
      };
    } catch (error) {
      console.error('Error fetching product analytics:', error);
      throw error;
    }
  }
}

export default new ProductService();
