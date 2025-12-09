import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '../api/services';

/**
 * Custom Hooks sử dụng React Query cho Products
 */

// Hook lấy danh sách tất cả products
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsService.getAllProducts(params),
  });
};

// Hook lấy chi tiết product
export const useProduct = (productId) => {
  return useQuery({
    queryKey: ['products', productId],
    queryFn: () => productsService.getProductById(productId),
    enabled: !!productId, // Chỉ fetch khi có productId
  });
};

// Hook lấy products theo type
export const useProductsByType = (type, params = {}) => {
  return useQuery({
    queryKey: ['products', 'type', type, params],
    queryFn: () => productsService.getProductsByType(type, params),
    enabled: !!type,
  });
};

// Hook search products
export const useSearchProducts = (searchTerm, params = {}) => {
  return useQuery({
    queryKey: ['products', 'search', searchTerm, params],
    queryFn: () => productsService.searchProducts(searchTerm, params),
    enabled: !!searchTerm,
  });
};

// Hook lấy featured products
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsService.getFeaturedProducts(),
  });
};

// Hook tính premium
export const useCalculatePremium = () => {
  return useMutation({
    mutationFn: ({ productId, calculationData }) =>
      productsService.calculatePremium(productId, calculationData),
  });
};

// Hook tạo product (Admin)
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsService.createProduct,
    onSuccess: () => {
      // Invalidate và refetch products
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Hook cập nhật product (Admin)
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, productData }) =>
      productsService.updateProduct(productId, productData),
    onSuccess: (_, variables) => {
      // Invalidate specific product và products list
      queryClient.invalidateQueries({ queryKey: ['products', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// Hook xóa product (Admin)
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
