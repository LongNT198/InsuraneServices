import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Label } from '../../../../shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { Alert, AlertDescription } from '../../../../shared/components/ui/alert';
import { Badge } from '../../../../shared/components/ui/badge';
import { DollarSign, Calendar, ArrowRight, ArrowLeft, CheckCircle2, CheckCircle, Info, RefreshCw, Shield, AlertCircle, Users } from 'lucide-react';
import axios from '../../../../shared/api/axios';
import { getPlansByProduct, calculatePlanPremium } from '../../../../shared/api/services/plansService';
import { applicationService } from '../../../../shared/api/services/applicationService';
import { toast } from 'sonner';

// Constants
const PAYMENT_FREQUENCIES = [
  { value: 'Monthly', label: 'Monthly', description: 'Pay every month', shortLabel: 'mo' },
  { value: 'Quarterly', label: 'Quarterly', description: 'Every 3 months', shortLabel: 'qtr' },
  { value: 'Semi-Annual', label: 'Semi-Annual', description: 'Every 6 months', shortLabel: '6mo' },
  { value: 'Annual', label: 'Annual', description: 'Once a year', shortLabel: 'yr' },
  { value: 'LumpSum', label: 'Single Pay', description: 'Pay once', shortLabel: 'total' }
];

const PAYMENT_METHODS = [
  { value: 'BankTransfer', label: 'Bank Transfer' },
  { value: 'CreditCard', label: 'Credit/Debit Card' },
  { value: 'DirectDebit', label: 'Direct Debit' },
  { value: 'Check', label: 'Check' }
];

export function ProductSelectionStep({ data, onChange, onNext, onPrevious, applicationId }) {
  // State management
  const [products, setProducts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState('');
  const [autoCalculated, setAutoCalculated] = useState(false); // Track if premium was auto-calculated
  
  const [formData, setFormData] = useState({
    productId: data.productId || '',
    planId: data.planId || '',
    paymentFrequency: data.paymentFrequency || 'Annual',
    paymentMethod: data.paymentMethod || 'BankTransfer',
  });

  const [premium, setPremium] = useState(data.premiumAmount || 0);

  // Memoized calculations
  const selectedProduct = useMemo(() => 
    products.find(p => p.id === parseInt(formData.productId)),
    [products, formData.productId]
  );

  const selectedPlan = useMemo(() => {
    const planId = parseInt(formData.planId);
    const found = plans.find(p => p.id === planId);
    console.log('🔍 selectedPlan calculation:', {
      formDataPlanId: formData.planId,
      parsedPlanId: planId,
      availablePlans: plans.map(p => ({ id: p.id, name: p.planName })),
      foundPlan: found ? { id: found.id, name: found.planName } : null
    });
    return found;
  }, [plans, formData.planId]);

  const userAge = useMemo(() => {
    if (!data.applicant?.dateOfBirth) return null;
    
    const birthDate = new Date(data.applicant.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }, [data.applicant?.dateOfBirth]);

  // Utility functions
  const getPremiumByFrequency = useCallback((plan, frequency) => {
    if (!plan) return 0;
    
    const premiumMap = {
      'Monthly': plan.basePremiumMonthly,
      'Quarterly': plan.basePremiumQuarterly || (plan.basePremiumMonthly * 3),
      'Semi-Annual': plan.basePremiumSemiAnnual || (plan.basePremiumMonthly * 6),
      'Annual': plan.basePremiumAnnual || (plan.basePremiumMonthly * 12),
      'LumpSum': plan.basePremiumLumpSum || (plan.basePremiumAnnual * plan.termYears)
    };
    
    return premiumMap[frequency] || plan.basePremiumAnnual || 0;
  }, []);

  const getFrequencyLabel = useCallback((frequency) => {
    return PAYMENT_FREQUENCIES.find(f => f.value === frequency)?.shortLabel || 'yr';
  }, []);

  const checkPlanEligibility = useCallback((plan) => {
    if (!userAge || !plan) return { isEligible: true, warning: null };
    
    if (userAge < plan.minAge) {
      return {
        isEligible: false,
        warning: `You must be at least ${plan.minAge} years old for this plan`
      };
    }
    
    if (userAge > plan.maxAge) {
      return {
        isEligible: false,
        warning: `This plan is available up to age ${plan.maxAge}`
      };
    }
    
    return { isEligible: true, warning: null };
  }, [userAge]);

  // Data loading
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/products');
      
      // Backend returns: { success: true, count: n, data: [...] }
      // Axios interceptor unwraps to: { success: true, count: n, data: [...] }
      const productsList = response?.data || [];
      
      if (!Array.isArray(productsList)) {
        console.error('❌ Products data is not an array:', productsList);
        throw new Error('Invalid products data format');
      }
      
      console.log('📦 Products loaded:', productsList);
      
      const lifeProducts = productsList.filter(p => 
        p.productType === 'Life Insurance' || p.productType === 'Life'
      );
      
      setProducts(lifeProducts);
    } catch (err) {
      setError('Failed to load Life Insurance products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPlans = useCallback(async (productId) => {
    try {
      setLoadingPlans(true);
      setError('');
      console.log('📋 Fetching plans for productId:', productId);
      const plansData = await getPlansByProduct(productId);
      console.log('✅ Plans loaded:', plansData?.length || 0, 'plans');
      setPlans(plansData || []);
    } catch (err) {
      console.error('❌ Error loading plans:', err);
      setError('Failed to load insurance plans');
    } finally {
      setLoadingPlans(false);
    }
  }, []);

  // Effects
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    console.log('🔍 ProductSelectionStep - data changed:', {
      dataProductId: data.productId,
      dataPlanId: data.planId,
      dataFrequency: data.paymentFrequency,
      dataPremium: data.premiumAmount,
      currentFormData: formData,
      products: products.length,
      plans: plans.length
    });
    
    // Update formData if any relevant data has changed
    const hasChanges = 
      (data.productId && data.productId !== formData.productId) ||
      (data.planId && data.planId !== formData.planId) ||
      (data.paymentFrequency && data.paymentFrequency !== formData.paymentFrequency);
    
    if (hasChanges) {
      console.log('✅ Updating formData with new data from parent:', {
        newProductId: data.productId,
        newPlanId: data.planId,
        newFrequency: data.paymentFrequency
      });
      setFormData(prev => ({
        ...prev,
        productId: data.productId || prev.productId,
        planId: data.planId || prev.planId,
        paymentFrequency: data.paymentFrequency || prev.paymentFrequency,
        paymentMethod: data.paymentMethod || prev.paymentMethod,
      }));
    }
    
    if (data.premiumAmount && data.premiumAmount !== premium) {
      console.log('✅ Updating premium:', data.premiumAmount);
      setPremium(parseFloat(data.premiumAmount));
    }
  }, [data.productId, data.planId, data.paymentFrequency, data.premiumAmount, products.length, plans.length]);

  useEffect(() => {
    console.log('🔍 ProductSelectionStep - productId changed:', {
      productId: formData.productId,
      willLoadPlans: Boolean(formData.productId)
    });
    
    if (formData.productId) {
      console.log('📋 Loading plans for productId:', formData.productId);
      loadPlans(formData.productId);
    } else {
      console.log('⚠️ No productId to load plans');
    }
  }, [formData.productId, loadPlans]);

  useEffect(() => {
    if (selectedPlan && userAge) {
      const { isEligible, warning } = checkPlanEligibility(selectedPlan);
      if (!isEligible) {
        // Show age requirement warning but DON'T auto-clear the selected plan
        // User should see the warning and manually choose another plan
        setError(`⚠️ Age Requirement: ${warning}`);
      } else {
        // Clear error if plan becomes eligible (e.g., user updated age)
        setError('');
      }
    }
  }, [selectedPlan, userAge, checkPlanEligibility]);

  // Auto-calculate premium when all required data is available
  useEffect(() => {
    const canAutoCalculate = 
      formData.productId && 
      formData.planId && 
      formData.paymentFrequency &&
      userAge && 
      userAge >= 18 &&
      data.applicant?.gender &&
      data.applicant?.dateOfBirth &&
      selectedPlan;
    
    if (canAutoCalculate) {
      const { isEligible } = checkPlanEligibility(selectedPlan);
      
      // Only auto-calculate if age is eligible and premium is not already set
      if (isEligible && premium === 0) {
        console.log('🔄 Auto-calculating premium with user data:', {
          planId: formData.planId,
          age: userAge,
          gender: data.applicant.gender,
          healthStatus: data.healthStatus,
          frequency: formData.paymentFrequency
        });
        getQuote();
      }
    }
  }, [
    formData.productId, 
    formData.planId, 
    formData.paymentFrequency,
    userAge,
    data.applicant?.gender,
    data.applicant?.dateOfBirth,
    data.healthStatus,
    selectedPlan,
    premium
  ]);

  // Event handlers
  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    
    // Reset premium when plan or payment frequency changes - will auto-recalculate
    if (field === 'planId' || field === 'paymentFrequency') {
      setPremium(0);
      setAutoCalculated(false); // Will trigger auto-calculation
      onChange({ [field]: value, premiumAmount: 0 });
    } else {
      // Sync with parent applicationData to prevent URL params from overwriting user changes
      onChange({ [field]: value });
    }
  }, [onChange]);

  const getQuote = useCallback(async () => {
    if (!formData.productId || !formData.planId) {
      setError('Please select a product and plan');
      return;
    }

    if (!data.applicant?.dateOfBirth) {
      setError('Please complete Step 1: Personal Information with your date of birth');
      return;
    }

    if (!userAge) {
      setError('Unable to calculate age from date of birth');
      return;
    }

    try {
      setCalculating(true);
      setError('');

      // Validate age requirements
      if (userAge < 18) {
        throw new Error('You must be at least 18 years old to apply for life insurance');
      }

      if (selectedPlan) {
        const { isEligible, warning } = checkPlanEligibility(selectedPlan);
        if (!isEligible) {
          throw new Error(warning);
        }
      }

      const request = {
        planId: parseInt(formData.planId),
        age: userAge,
        gender: data.applicant?.gender || 'Male',
        healthStatus: data.healthStatus || 'Good',
        occupationRisk: data.applicant?.occupationRisk || 'Low',
        paymentFrequency: formData.paymentFrequency
      };

      const result = await calculatePlanPremium(request);
      const calculatedValue = result?.calculatedPremium || result?.CalculatedPremium || 
                             result?.premium || result?.Premium;

      if (typeof calculatedValue !== 'number') {
        throw new Error('Invalid response from premium calculation API');
      }

      setPremium(calculatedValue);
      setAutoCalculated(true); // Mark as auto-calculated
      onChange({ premiumAmount: calculatedValue });
      
      // Show success toast for manual calculation only (not auto-calc)
      if (!calculating) {
        toast.success('Premium Calculated', {
          description: `Your personalized premium: $${calculatedValue.toLocaleString()}`,
          duration: 3000,
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 
                          'Failed to calculate quote. Please try again.';
      setError(errorMessage);
      setAutoCalculated(false);
      
      toast.error('Calculation Failed', {
        description: errorMessage,
        duration: 4000,
      });
    } finally {
      setCalculating(false);
    }
  }, [formData, data, userAge, selectedPlan, checkPlanEligibility, onChange]);

  const handleNext = useCallback(async () => {
    // Validation
    if (!formData.productId) {
      const errorMsg = 'Please select a product';
      setError(errorMsg);
      toast.error('Validation Error', { description: errorMsg });
      return;
    }

    if (!formData.planId) {
      const errorMsg = 'Please select an insurance plan';
      setError(errorMsg);
      toast.error('Validation Error', { description: errorMsg });
      return;
    }

    if (premium === 0 && !data.premiumAmount) {
      const errorMsg = 'Premium calculation is in progress. Please wait...';
      setError(errorMsg);
      toast.warning('Please Wait', { description: errorMsg });
      return;
    }

    if (!selectedPlan) {
      setError('Selected plan not found');
      return;
    }

    // Prepare complete data
    const completeData = {
      ...formData,
      premiumAmount: premium || data.premiumAmount,
      coverageAmount: selectedPlan.coverageAmount || 0,
      termYears: selectedPlan.termYears || 0,
    };

    // Progressive saving: Save to application if applicationId exists
    if (applicationId) {
      try {
        setCalculating(true);
        await applicationService.updateProduct(applicationId, completeData);
        console.log('✅ Product selection saved to application');
      } catch (err) {
        console.error('❌ Failed to save product selection:', err);
        setError('Failed to save product selection. Please try again.');
        setCalculating(false);
        return;
      } finally {
        setCalculating(false);
      }
    }

    onChange(completeData);
    onNext();
  }, [formData, premium, data.premiumAmount, selectedPlan, onChange, onNext, applicationId]);

  // Render loading state
  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin size-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading insurance products...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="text-2xl">Select Your Insurance Product & Plan</CardTitle>
          <CardDescription className="text-base">
            Choose the insurance product and plan that best fits your needs and financial goals
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert className="border-2 border-red-500 bg-red-50">
              <AlertCircle className="size-4 text-red-600" />
              <AlertDescription className="text-sm text-red-900">
                <strong>Age Requirement:</strong> {error.replace('⚠️ Age Requirement: ', '')} Please select a different plan to continue.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Age Verification Info */}
          {userAge && (
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="size-4 text-blue-600" />
              <AlertDescription className="text-sm text-gray-700">
                <strong>Age Verification Active:</strong> You are {userAge} years old. Only plans matching your age eligibility will be shown.
              </AlertDescription>
            </Alert>
          )}

          {/* Product Selection */}
          <div className="space-y-2">
            <Label htmlFor="product">Insurance Product *</Label>
            <Select
              value={formData.productId}
              onValueChange={(value) => handleChange('productId', value)}
            >
              <SelectTrigger id="product">
                <SelectValue placeholder="Select a product">
                  {selectedProduct ? `${selectedProduct.productName} - ${selectedProduct.productType}` : 'Select a product'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {products.map(product => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.productName} - {product.productType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Frequency Selector - Plans Tab Style */}
          {selectedProduct && plans.length > 0 && (
            <div className="mb-12">
              <div className="text-center mb-6">
                <p className="text-gray-600">
                  Choose how often you'd like to pay your premiums
                </p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                {PAYMENT_FREQUENCIES.map((freq) => (
                  <Button
                    key={freq.value}
                    type="button"
                    variant={formData.paymentFrequency === freq.value ? 'default' : 'outline'}
                    onClick={() => handleChange('paymentFrequency', freq.value)}
                    className={`cursor-pointer ${formData.paymentFrequency === freq.value 
                      ? '!bg-purple-600 hover:!bg-purple-700 !text-white !border-purple-600' 
                      : ''}`}
                  >
                    {freq.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Plans Section - Plans Tab Style */}
          {selectedProduct && (
            <div>
              <div className="text-center mb-8">
                <p className="text-gray-600">
                  Compare coverage options and select the plan that fits your needs
                </p>
              </div>
              {loadingPlans ? (
                <div className="text-center py-12">
                  <div className="animate-spin size-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-4">Loading available plans...</p>
                </div>
              ) : plans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {plans.map((plan) => {
                    const displayPremium = getPremiumByFrequency(plan, formData.paymentFrequency);
                    const frequencyLabel = getFrequencyLabel(formData.paymentFrequency);
                    const { isEligible: isAgeEligible, warning: ageWarning } = checkPlanEligibility(plan);
                    const isSelected = parseInt(formData.planId) === plan.id;
                    
                    if (plan.id === parseInt(formData.planId)) {
                      console.log('✅ Plan card rendering - SELECTED:', {
                        planId: plan.id,
                        planName: plan.planName,
                        formDataPlanId: formData.planId,
                        isSelected
                      });
                    }
                    
                    return (
                      <Card 
                        key={plan.id}
                        onClick={() => isAgeEligible && handleChange('planId', plan.id.toString())}
                        className={`hover:shadow-lg transition-shadow cursor-pointer ${
                          !isAgeEligible ? 'opacity-50 cursor-not-allowed' : ''
                        } ${isSelected ? 'border-2 border-purple-500 ring-2 ring-purple-200' : ''} ${
                          plan.isPopular ? 'border-2 border-purple-500' : ''
                        }`}
                      >
                        <CardHeader>
                          {plan.isPopular && (
                            <Badge className="w-fit mb-2">Featured</Badge>
                          )}
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center">
                              <Shield className="size-6" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{plan.planName}</CardTitle>
                              <p className="text-xs text-gray-600">Age {plan.minAge || 18}-{plan.maxAge || 65}</p>
                            </div>
                          </div>
                          <CardDescription>
                            ${(plan.coverageAmount / 1000).toLocaleString()}k coverage • {plan.termYears} years term
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {/* Price Display */}
                            <div className="text-center py-4 bg-gray-50 rounded-lg">
                              <p className="text-xs text-gray-600 mb-1">Base Premium</p>
                              <p className="text-2xl font-bold text-purple-600">
                                ${Math.round(displayPremium).toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                per {formData.paymentFrequency === 'LumpSum' ? 'policy' : 
                                     formData.paymentFrequency === 'Monthly' ? 'month' :
                                     formData.paymentFrequency === 'Quarterly' ? 'quarter' :
                                     formData.paymentFrequency === 'Semi-Annual' ? '6 months' : 'year'}
                              </p>
                            </div>

                            {/* Age Warning */}
                            {!isAgeEligible && ageWarning && (
                              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                  <AlertCircle className="size-4 text-orange-600 flex-shrink-0 mt-0.5" />
                                  <p className="text-xs text-orange-700">{ageWarning}</p>
                                </div>
                              </div>
                            )}

                            {/* Key Benefits */}
                            <div>
                              <p className="text-sm font-semibold mb-2">Key Benefits</p>
                              <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="size-4 text-green-500 flex-shrink-0 mt-0.5" />
                                  <span>${(plan.coverageAmount / 1000).toLocaleString()}k death benefit</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="size-4 text-green-500 flex-shrink-0 mt-0.5" />
                                  <span>{plan.termYears} years coverage period</span>
                                </li>
                                {plan.accidentalDeathBenefit > 0 && (
                                  <li className="flex items-start gap-2 text-sm">
                                    <CheckCircle className="size-4 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span>${(plan.accidentalDeathBenefit / 1000).toLocaleString()}k accidental death benefit</span>
                                  </li>
                                )}
                                {plan.criticalIllnessBenefit > 0 && (
                                  <li className="flex items-start gap-2 text-sm">
                                    <CheckCircle className="size-4 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span>${(plan.criticalIllnessBenefit / 1000).toLocaleString()}k critical illness cover</span>
                                  </li>
                                )}
                              </ul>
                            </div>

                            {/* Medical Exam Requirement */}
                            {plan.requiresMedicalExam && (
                              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                  <AlertCircle className="size-4 text-orange-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-xs font-semibold text-orange-900">Medical Exam Required</p>
                                    <p className="text-xs text-orange-700 mt-0.5">Health screening needed for this plan</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Selected Indicator */}
                            {isSelected && (
                              <div className="pt-3 border-t flex items-center justify-center gap-2 text-purple-600 font-semibold">
                                <CheckCircle2 className="size-5" />
                                <span>Selected</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center mt-4">
                  <Info className="size-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No plans available for this product</p>
                  <p className="text-sm text-gray-500 mt-1">Please select a different product</p>
                </div>
              )}
            </div>
          )}

          {/* Payment Method */}
          {selectedPlan && (
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Select Payment Method</CardTitle>
                <CardDescription>Choose how you would like to pay your premium</CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleChange('paymentMethod', value)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map(method => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {/* Auto-Calculating or Manual Calculate Button */}
          {selectedPlan && (
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                {calculating ? (
                  /* Auto-calculating indicator */
                  <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="animate-spin size-5 border-2 border-blue-600 border-t-transparent rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-blue-900">Calculating Your Premium</h3>
                      <p className="text-xs text-blue-700">Based on your age, health status, and selected plan...</p>
                    </div>
                  </div>
                ) : premium > 0 && autoCalculated ? (
                  /* Premium auto-calculated successfully */
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="bg-green-600 text-white w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="size-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-green-900">Premium Calculated</h3>
                      <p className="text-xs text-green-700">Personalized based on your information</p>
                    </div>
                    <Button
                      onClick={getQuote}
                      variant="outline"
                      size="sm"
                      className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                      <RefreshCw className="size-3 mr-1.5" />
                      Recalculate
                    </Button>
                  </div>
                ) : (
                  /* Manual calculate button (fallback if auto-calc didn't trigger) */
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                        <DollarSign className="size-4" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900">Calculate Your Premium</h3>
                        <p className="text-xs text-gray-600">Based on your profile and selected plan</p>
                      </div>
                    </div>
                  
                    <Button
                      onClick={getQuote}
                      disabled={!formData.planId}
                      className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <DollarSign className="size-4 mr-2" />
                      Calculate Premium
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Premium Result */}
          {premium > 0 && selectedPlan && checkPlanEligibility(selectedPlan).isEligible && (
            <Card className="border-2 border-green-600 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 text-green-600 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">Your Premium Quote</CardTitle>
                    <CardDescription className="text-xs">Calculated based on your profile</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-3">

              {/* Product & Plan Info */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-blue-900">Product:</span>
                    <span className="text-xs font-bold text-blue-900">
                      {selectedProduct?.productName || 'Life Insurance'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-blue-900">Plan:</span>
                    <span className="text-xs font-bold text-blue-900">
                      {selectedPlan?.planName || 'Standard Plan'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Premium Amount */}
              <div className="text-center mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-xs text-green-600 font-semibold mb-1">
                  {formData.paymentFrequency === 'LumpSum' ? 'One-Time Payment' : 
                   `${formData.paymentFrequency} Premium`}
                </div>
                <div className="text-3xl font-bold text-green-600 mb-1">
                  ${premium.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">
                  {formData.paymentFrequency === 'LumpSum' 
                    ? `for ${selectedPlan.termYears}-year term` 
                    : `per ${getFrequencyLabel(formData.paymentFrequency)}`}
                </div>
              </div>

              {/* Calculation Breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="size-3.5 text-blue-600" />
                  <h4 className="text-xs font-semibold text-gray-900">Calculation Factors</h4>
                </div>
                
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between py-1.5 px-2 bg-gray-50 rounded">
                    <span className="text-gray-700">Base Premium (Annual)</span>
                    <span className="font-semibold text-gray-900">
                      ${selectedPlan.basePremiumAnnual?.toLocaleString() || 0}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-1.5 px-2 bg-gray-50 rounded">
                    <span className="text-gray-700">Your Age</span>
                    <span className="font-semibold text-gray-900">
                      {userAge ? `${userAge} years` : 'N/A'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-1.5 px-2 bg-gray-50 rounded">
                    <span className="text-gray-700">Health Status</span>
                    <span className="font-semibold text-gray-900">
                      {data.healthStatus || 'Good'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-1.5 px-2 bg-gray-50 rounded">
                    <span className="text-gray-700">Occupation Risk</span>
                    <span className="font-semibold text-gray-900">
                      {data.applicant?.occupationRisk || 'Low'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coverage Summary */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-gray-50 rounded border">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Shield className="size-3.5 text-blue-600" />
                    <p className="text-xs text-gray-600 font-semibold">Coverage</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    ${selectedPlan.coverageAmount?.toLocaleString() || 0}
                  </p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded border">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Calendar className="size-3.5 text-blue-600" />
                    <p className="text-xs text-gray-600 font-semibold">Term Length</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedPlan.termYears} years
                  </p>
                </div>
              </div>
              </CardContent>
            </Card>
          )}

          {/* Medical Exam Notice */}
          {premium > 0 && selectedPlan?.requiresMedicalExam && (
            <Alert className="border-2 border-amber-500 bg-amber-50">
              <AlertCircle className="size-4 text-amber-600" />
              <AlertDescription className="text-sm text-amber-900">
                <strong>Medical Examination Required:</strong> The insurance plan requires a health check-up when enrolling (scheduled at no cost after submission, results in 5-7 business days).
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button 
          onClick={onPrevious} 
          variant="outline" 
          size="lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Health Declaration
        </Button>
        
        <Button 
          onClick={handleNext} 
          size="lg"
          disabled={
            !formData.planId || 
            premium === 0 || 
            (selectedPlan && userAge && !checkPlanEligibility(selectedPlan).isEligible)
          }
          className="bg-gray-900 hover:bg-gray-800 text-white"
        >
          Continue to Beneficiaries
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
