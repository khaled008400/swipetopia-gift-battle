
import { supabase } from '@/lib/supabase';

class StorageService {
  /**
   * Create a new storage bucket
   */
  async createBucket(name: string, isPublic: boolean = false): Promise<boolean> {
    try {
      const { error } = await supabase.storage.createBucket(name, {
        public: isPublic
      });
      
      if (error) {
        console.error('Error creating bucket:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in createBucket:', error);
      throw error;
    }
  }
  
  /**
   * Delete a storage bucket
   */
  async deleteBucket(name: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage.deleteBucket(name);
      
      if (error) {
        console.error('Error deleting bucket:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteBucket:', error);
      throw error;
    }
  }
  
  /**
   * Get all buckets
   */
  async getBuckets() {
    try {
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Error listing buckets:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getBuckets:', error);
      throw error;
    }
  }
  
  /**
   * Get files in a bucket
   */
  async getFiles(bucketName: string, path: string = '') {
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .list(path);
      
      if (error) {
        console.error('Error listing files:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getFiles:', error);
      throw error;
    }
  }
  
  /**
   * Delete a file
   */
  async deleteFile(bucketName: string, path: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([path]);
      
      if (error) {
        console.error('Error deleting file:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteFile:', error);
      throw error;
    }
  }
}

export default new StorageService();
