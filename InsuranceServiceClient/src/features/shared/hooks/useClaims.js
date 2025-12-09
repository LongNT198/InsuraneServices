import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { claimsService } from '../api/services';

/**
 * Custom Hooks sử dụng React Query cho Claims
 */

// Hook lấy danh sách claims
export const useClaims = (params = {}) => {
  return useQuery({
    queryKey: ['claims', params],
    queryFn: () => claimsService.getUserClaims(params),
  });
};

// Hook lấy chi tiết claim
export const useClaim = (claimId) => {
  return useQuery({
    queryKey: ['claims', claimId],
    queryFn: () => claimsService.getClaimById(claimId),
    enabled: !!claimId,
  });
};

// Hook lấy documents của claim
export const useClaimDocuments = (claimId) => {
  return useQuery({
    queryKey: ['claims', claimId, 'documents'],
    queryFn: () => claimsService.getClaimDocuments(claimId),
    enabled: !!claimId,
  });
};

// Hook lấy history của claim
export const useClaimHistory = (claimId) => {
  return useQuery({
    queryKey: ['claims', claimId, 'history'],
    queryFn: () => claimsService.getClaimHistory(claimId),
    enabled: !!claimId,
  });
};

// Hook lấy comments
export const useClaimComments = (claimId) => {
  return useQuery({
    queryKey: ['claims', claimId, 'comments'],
    queryFn: () => claimsService.getClaimComments(claimId),
    enabled: !!claimId,
  });
};

// Hook tạo claim
export const useCreateClaim = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: claimsService.createClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
    },
  });
};

// Hook upload document
export const useUploadClaimDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ claimId, formData }) =>
      claimsService.uploadClaimDocument(claimId, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['claims', variables.claimId, 'documents'] });
    },
  });
};

// Hook xóa document
export const useDeleteClaimDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ claimId, documentId }) =>
      claimsService.deleteClaimDocument(claimId, documentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['claims', variables.claimId, 'documents'] });
    },
  });
};

// Hook cập nhật claim
export const useUpdateClaim = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ claimId, claimData }) =>
      claimsService.updateClaim(claimId, claimData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['claims', variables.claimId] });
      queryClient.invalidateQueries({ queryKey: ['claims'] });
    },
  });
};

// Hook hủy claim
export const useCancelClaim = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ claimId, reason }) =>
      claimsService.cancelClaim(claimId, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['claims', variables.claimId] });
      queryClient.invalidateQueries({ queryKey: ['claims'] });
    },
  });
};

// Hook thêm comment
export const useAddClaimComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ claimId, comment }) =>
      claimsService.addClaimComment(claimId, comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['claims', variables.claimId, 'comments'] });
    },
  });
};
