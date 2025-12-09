import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { policiesService } from '../api/services';

/**
 * Custom Hooks sử dụng React Query cho Policies
 */

// Hook lấy danh sách policies của user
export const usePolicies = (params = {}) => {
  return useQuery({
    queryKey: ['policies', params],
    queryFn: () => policiesService.getUserPolicies(params),
  });
};

// Hook lấy chi tiết policy
export const usePolicy = (policyId) => {
  return useQuery({
    queryKey: ['policies', policyId],
    queryFn: () => policiesService.getPolicyById(policyId),
    enabled: !!policyId,
  });
};

// Hook lấy payment history của policy
export const usePolicyPaymentHistory = (policyId) => {
  return useQuery({
    queryKey: ['policies', policyId, 'payments'],
    queryFn: () => policiesService.getPolicyPaymentHistory(policyId),
    enabled: !!policyId,
  });
};

// Hook lấy beneficiaries
export const useBeneficiaries = (policyId) => {
  return useQuery({
    queryKey: ['policies', policyId, 'beneficiaries'],
    queryFn: () => policiesService.getBeneficiaries(policyId),
    enabled: !!policyId,
  });
};

// Hook tạo policy mới
export const useCreatePolicy = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: policiesService.createPolicy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policies'] });
    },
  });
};

// Hook gia hạn policy
export const useRenewPolicy = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ policyId, renewalData }) =>
      policiesService.renewPolicy(policyId, renewalData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['policies', variables.policyId] });
      queryClient.invalidateQueries({ queryKey: ['policies'] });
    },
  });
};

// Hook hủy policy
export const useCancelPolicy = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ policyId, reason }) =>
      policiesService.cancelPolicy(policyId, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['policies', variables.policyId] });
      queryClient.invalidateQueries({ queryKey: ['policies'] });
    },
  });
};

// Hook cập nhật policy
export const useUpdatePolicy = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ policyId, policyData }) =>
      policiesService.updatePolicy(policyId, policyData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['policies', variables.policyId] });
      queryClient.invalidateQueries({ queryKey: ['policies'] });
    },
  });
};

// Hook cập nhật beneficiaries
export const useUpdateBeneficiaries = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ policyId, beneficiaries }) =>
      policiesService.updateBeneficiaries(policyId, beneficiaries),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['policies', variables.policyId, 'beneficiaries'] });
    },
  });
};
