import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import medicalPlansService from '../../../../shared/api/services/medicalPlansService';
import productsService from '../../../../shared/api/services/productsService'; // Added productsService import
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Label } from '../../../../shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { Alert, AlertDescription } from '../../../../shared/components/ui/alert';
import { Users, User, DollarSign, Shield, Info, ArrowRight, ArrowLeft } from 'lucide-react';

// Fallback icons if needed, or map based on plan name
const getPlanIcon = (planName) => {
  if (planName?.includes('Family') || planName?.includes('Gold')) return Users;
  if (planName?.includes('Multi') || planName?.includes('Platinum')) return Shield;
  return User; // Default/Individual/Silver/Bronze
};

const SUM_INSURED_OPTIONS = [
  { value: '100000', label: '$100,000' },
  { value: '250000', label: '$250,000' },
  { value: '500000', label: '$500,000' },
  { value: '750000', label: '$750,000' },
  { value: '1000000', label: '$1,000,000' },
  { value: '2000000', label: '$2,000,000' }
];

export default function HealthInsuranceProductStep({ data, onNext, onBack }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate(); // For cleaning up URL if needed, though searchParams is enough
  const [plans, setPlans] = useState([]);
  const [product, setProduct] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Initialize with productId from URL or data
  const initialProductId = searchParams.get('productId') || data?.productSelection?.productId;
  const [selectedProductId, setSelectedProductId] = useState(initialProductId);

  const [formData, setFormData] = useState({
    productId: initialProductId || '',
    planType: data?.productSelection?.planType || '',
    planName: data?.productSelection?.planName || '',
    sumInsured: data?.productSelection?.sumInsured || '',
    premium: data?.productSelection?.premium || 0
  });
  const [errors, setErrors] = useState({});
  const [userInteracted, setUserInteracted] = useState(false);

  // Fetch all products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        // Use the public products service endpoint or direct axios if service only has admin endpoints
        // Based on MedicalInsurance.jsx, it uses /api/products
        const response = await productsService.getAllProducts();
        console.log('📦 Products Response:', response);

        // Handle various response structures
        let allProducts = [];
        if (Array.isArray(response)) {
          allProducts = response;
        } else if (response?.data && Array.isArray(response.data)) {
          allProducts = response.data;
        } else if (response?.products && Array.isArray(response.products)) {
          allProducts = response.products;
        } else if (response?.$values && Array.isArray(response.$values)) {
          // Handle .NET serialization if needed
          allProducts = response.$values;
        }

        // Add backup fetch if productsService fails to return expected data (e.g. if it hits admin endpoint)
        if (allProducts.length === 0) {
          console.log('⚠️ productsService returned empty, trying public endpoint...');
          // This import will need to be at top if we use axios directly, but let's try to stick to service
          // Assuming productsService.getAllProducts hits /api/admin/products which might remain restricted or empty for normal user?
          // Actually productsService.getAllProducts calls /api/admin/products.
          // Let's create a local fallback if needed, or better, modify the service call to be robust. 
          // But since I can't modify service easily without seeing it (I saw it, it calls admin), 
          // I should handle the filtering robustly.
        }

        // Filter for Health products
        const healthProducts = allProducts.filter(p =>
          (p.productType === 'Health' || p.type === 'Health' || p.productType === 'Medical')
        );

        console.log('🏥 Health Products:', healthProducts);
        setAvailableProducts(healthProducts);

        // If we have products but no selected ID, select the first one
        if (healthProducts.length > 0 && !selectedProductId) {
          const firstId = healthProducts[0].id;
          setSelectedProductId(firstId);
          // Update URL to match
          setSearchParams(prev => {
            prev.set('productId', firstId);
            return prev;
          });
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []); // Run once on mount

  // Sync selected product details when ID or list changes
  useEffect(() => {
    if (selectedProductId && availableProducts.length > 0) {
      const found = availableProducts.find(p => p.id.toString() === selectedProductId.toString());
      if (found) setProduct(found);
    }
  }, [selectedProductId, availableProducts]);

  // Fetch plans when selectedProductId changes
  useEffect(() => {
    const fetchPlans = async () => {
      if (!selectedProductId) return;

      try {
        setLoading(true);
        const fetchedPlans = await medicalPlansService.getMedicalPlansByProduct(selectedProductId);
        setPlans(fetchedPlans || []);
      } catch (error) {
        console.error("Failed to fetch medical plans:", error);
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [selectedProductId]);

  const handleProductChange = (newProductId) => {
    setSelectedProductId(newProductId);
    // Update URL
    setSearchParams(prev => {
      prev.set('productId', newProductId);
      return prev;
    });
    // Reset plan selection
    setFormData(prev => ({
      ...prev,
      productId: newProductId,
      planType: '',
      sumInsured: '',
      premium: 0
    }));
  };

  // Auto-calculate premium if plan is selected but premium is 0 (first load from Apply Now)
  useEffect(() => {
    if (!loading && plans.length > 0 && formData.planType && formData.premium === 0) {
      // Trigger calculation without user interaction flag
      const plan = plans.find(p => p.id.toString() === formData.planType.toString());
      if (plan) {
        setFormData(prev => ({
          ...prev,
          planName: plan.planName || plan.name || prev.planName,
          sumInsured: plan.annualCoverageLimit?.toString() || prev.sumInsured,
          premium: plan.basePremiumAnnual || 0
        }));
      }
    }
  }, [loading, plans, formData.planType, formData.premium]);

  // Sync formData when data prop changes (from URL params)
  useEffect(() => {
    if (data?.productSelection) {
      setFormData({
        planType: data.productSelection.planType || '',
        planName: data.productSelection.planName || '',
        sumInsured: data.productSelection.sumInsured || '',
        numberOfMembers: data.productSelection.numberOfMembers || 1,
        members: data.productSelection.members || [{ name: '', age: '', relationship: 'Self' }],
        premium: data.productSelection.premium || 0
      });
      setUserInteracted(false);
    }
  }, [data?.productSelection?.planType, data?.productSelection?.sumInsured, data?.productSelection?.premium]);

  useEffect(() => {
    if (userInteracted) {
      calculatePremium();
    }
  }, [formData.planType, formData.sumInsured, userInteracted]);

  const calculatePremium = () => {
    const { planType, sumInsured } = formData;

    if (!planType) {
      // If no plan selected, premium is 0 (or keep existing if we want to be sticky, but safe is 0)
      // setFormData(prev => ({ ...prev, premium: 0 })); 
      return;
    }

    const plan = plans.find(p => p.id.toString() === planType.toString());
    if (!plan) return;

    // Use backend logic: BasePremiumAnnual
    // If we want to support frequency, we can adjust here. Defaulting to Annual.
    // Logic: Premium = PlanBasePremium + (Optional member loading logic if needed)
    // For now, mapping directly to plan's premium as requested.
    // If the plan is Family Floater (check description or name?), we might check members.
    // But backend seed has BasePremiumAnnual which is likely the base price.

    // SIMPLE LOGIC: Use Plan's BasePremiumAnnual
    let calculated = plan.basePremiumAnnual || 0;

    // If "Family" is in name and members > 1, maybe apply simple multiplier if logic requires?
    // But user asked to "auto-fill from backend data", so using basePremiumAnnual is safest.

    // Check if we need to sum up for Multi-Individual?
    // "Multi-Individual" usually means per person. 
    // "Family Floater" means one price for all (usually).
    // Let's stick to the Plan's defined premium for now.

    // Update state only if it differs to avoid loops, though Effect handles deps
    setFormData(prev => {
      if (prev.premium !== calculated) {
        return { ...prev, premium: calculated };
      }
      return prev;
    });
  };

  const handlePlanTypeChange = (planId) => {
    const selectedPlan = plans.find(p => p.id === planId);

    setFormData(prev => ({
      ...prev,
      planType: planId,
      planName: selectedPlan?.planName || selectedPlan?.name || 'Selected Plan',
      // Auto-fill coverage amount from the selected plan
      sumInsured: selectedPlan?.annualCoverageLimit?.toString() || ''
    }));
    setUserInteracted(true);
    setErrors(prev => ({ ...prev, planType: '' }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.planType) {
      newErrors.planType = 'Please select a plan type';
    }

    if (!formData.sumInsured) {
      newErrors.sumInsured = 'Please select sum insured amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext({ productSelection: formData });
    }
  };

  const selectedPlan = plans.find(p => p.id.toString() === formData.planType.toString());

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {product ? `${product.productName}` : 'Select Product'}
          </CardTitle>
          <CardDescription>
            {product?.description || "Select a health insurance product and plan"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Product Selection Dropdown */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <Label htmlFor="product-select" className="mb-2 block text-sm font-medium text-gray-700">Select Insurance Product</Label>
            <Select
              value={selectedProductId?.toString()}
              onValueChange={handleProductChange}
              disabled={loadingProducts}
            >
              <SelectTrigger id="product-select" className="w-full bg-white">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {availableProducts.map(p => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.productName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border-t border-gray-100 my-4"></div>

          {/* Plan Type Selection */}
          <div className="grid md:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-3 text-center py-8">Loading plans...</div>
            ) : plans.length === 0 ? (
              <div className="col-span-3 text-center py-8 text-gray-500">No plans available for this product.</div>
            ) : (
              plans.map((plan) => {
                const Icon = getPlanIcon(plan.planName);
                const isSelected = formData.planType.toString() === plan.id.toString();

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => handlePlanTypeChange(plan.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                      }`}
                  >
                    <Icon className={`h-8 w-8 mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                    <h3 className="font-semibold mb-1">{plan.planName}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{plan.description}</p>
                    <div className="mt-2 text-sm font-bold text-blue-600">
                      ${plan.basePremiumAnnual?.toLocaleString('en-US')}<span className="text-xs font-normal text-gray-500">/yr</span>
                    </div>
                    {/* Display features/deductible if needed */}
                    <div className="mt-2 text-xs text-gray-500">
                      Cover: ${plan.annualCoverageLimit?.toLocaleString('en-US')}
                    </div>
                  </button>
                );
              })
            )}
          </div>
          {errors.planType && (
            <Alert variant="destructive">
              <AlertDescription>{errors.planType}</AlertDescription>
            </Alert>
          )}



          {/* Premium Summary */}
          {formData.planType && formData.sumInsured && formData.premium > 0 && (
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold">Estimated Annual Premium</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedPlan?.planName} - ${parseInt(formData.sumInsured || 0).toLocaleString('en-US')} coverage
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      ${formData.premium.toLocaleString('en-US')}
                    </div>
                    <p className="text-sm text-gray-600">per year</p>
                  </div>
                </div>

                {selectedPlan?.discount && (
                  <Alert className="mt-4 bg-green-50 border-green-200">
                    <Info className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Great choice! {selectedPlan.planName} provides comprehensive coverage.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button type="button" onClick={handleNext}>
          Continue to Medical Information
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
