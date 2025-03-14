
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminService, { AdminProduct } from '@/services/admin.service';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProductsTable from './ProductsTable';
import ProductsPagination from './ProductsPagination';
import ProductFilters from './ProductFilters';
import ProductForm, { ProductFormData } from './ProductForm';

const AdminProducts = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['adminProducts', page, categoryFilter],
    queryFn: () => AdminService.getProducts(page, categoryFilter),
  });

  const createProductMutation = useMutation({
    mutationFn: (productData: ProductFormData) => {
      // Ensure all required fields are present even if they were optional in the form
      const completeProductData: Omit<AdminProduct, 'id'> = {
        name: productData.name,
        price: productData.price,
        description: productData.description || '',
        image: productData.image,
        inventory: productData.inventory,
        category: productData.category,
        status: productData.status
      };
      return AdminService.createProduct(completeProductData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      setShowProductDialog(false);
      toast({
        title: "Product created",
        description: "Product has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create product.",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: ProductFormData }) => {
      // Ensure all required fields are present for the update
      const completeProductData: Partial<AdminProduct> = {
        name: data.name,
        price: data.price,
        description: data.description || '',
        image: data.image,
        inventory: data.inventory,
        category: data.category,
        status: data.status
      };
      return AdminService.updateProduct(id, completeProductData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      setShowProductDialog(false);
      toast({
        title: "Product updated",
        description: "Product has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update product.",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) => AdminService.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
      toast({
        title: "Product deleted",
        description: "Product has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    },
  });

  const handleCreateProduct = () => {
    setDialogMode('create');
    setSelectedProduct(null);
    setShowProductDialog(true);
  };

  const handleEditProduct = (product: AdminProduct) => {
    setSelectedProduct(product);
    setDialogMode('edit');
    setShowProductDialog(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      deleteProductMutation.mutate(productId);
    }
  };

  const handleFormSubmit = (data: ProductFormData) => {
    if (dialogMode === 'create') {
      createProductMutation.mutate(data);
    } else if (dialogMode === 'edit' && selectedProduct) {
      updateProductMutation.mutate({ id: selectedProduct.id, data });
    }
  };

  return (
    <div className="space-y-4">
      <ProductFilters 
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        onCreateClick={handleCreateProduct}
      />

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <ProductsTable
            products={data?.data || []}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />

          {data?.pagination && (
            <ProductsPagination
              pagination={data.pagination}
              currentPage={page}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="w-full max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Add New Product' : 'Edit Product'}
            </DialogTitle>
          </DialogHeader>
          
          <ProductForm
            initialData={selectedProduct}
            onSubmit={handleFormSubmit}
            mode={dialogMode}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
