import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Calculator, X, Info, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import { saveCalculatorDraft } from '../../../shared/api/services/draftService';
import { useAuth } from '../../../../core/contexts/AuthContext';
import { getPlansByProduct, calculatePlanPremium } from '../../../shared/api/services/plansService';

export function MiniCalculator({ product, productType }) {
  const { isAuthenticated } = useAuth();
  
  // Plan selection state
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [loadingPlans, setLoadingPlans] = useState(false);
  
  // User profile inputs for premium calculation
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('Male');
  const [healthStatus, setHealthStatus] = useState('Good');
  const [occupationRisk, setOccupationRisk] = useState('Low');
  const [paymentFrequency, setPaymentFrequency] = useState('Annual');
  
  // Calculation result
  const [calculationResult, setCalculationResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // UI state
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load plans when modal opens
  useEffect(() => {
    if (isOpen && product?.id && plans.length === 0) {
      loadPlans();
    }
  }, [isOpen, product?.id]);

  const loadPlans = async () => {
    setLoadingPlans(true);
    try {
      const response = await getPlansByProduct(product.id);
      setPlans(response);
      
      // Auto-select featured/popular plan or first plan
      if (response.length > 0) {
        const featuredPlan = response.find(p => p.isFeatured || p.isPopular);
        setSelectedPlanId(featuredPlan?.id || response[0].id);
      }
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleCalculate = async () => {
    if (!selectedPlanId) {
      alert('Please select a plan first');
      return;
    }

    setIsCalculating(true);
    try {
      const request = {
        planId: selectedPlanId,
        age,
        gender,
        healthStatus,
        occupationRisk,
        paymentFrequency
      };

      const result = await calculatePlanPremium(request);
      setCalculationResult(result);
    } catch (error) {
      console.error('Error calculating premium:', error);
      alert('Error calculating premium. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleProceedToApply = async () => {
    if (!calculationResult) return;

    setIsSaving(true);
    try {
      const params = {
        productId: product?.id,
        planId: selectedPlanId,
        type: productType,
        applicationType: productType === 'Medical' ? 'HealthInsurance' : 'LifeInsurance',
        age,
        gender,
        healthStatus,
        occupationRisk,
        paymentFrequency,
        premiumAmount: calculationResult.calculatedPremium,
        timestamp: Date.now()
      };

      // Save to API if authenticated, otherwise localStorage
      if (isAuthenticated) {
        console.log('💾 Saving calculator params to API...');
        await saveCalculatorDraft(params);
        console.log('✅ Draft saved to database');
      } else {
        console.log('💾 Saving to localStorage (not logged in)');
        console.log('💾 Params to save:', params);
        localStorage.setItem('calculatorParams', JSON.stringify(params));
        console.log('✅ Saved to localStorage, verify:', localStorage.getItem('calculatorParams'));
      }

      // Navigate to application
      let targetUrl;
      switch(productType) {
        case 'Life':
          targetUrl = `/apply-life?productId=${product?.id}&planId=${selectedPlanId}`;
          break;
        case 'Medical':
        case 'Health':
          targetUrl = `/apply-health?productId=${product?.id}&planId=${selectedPlanId}`;
          break;
        case 'Motor':
          targetUrl = `/apply-motor?productId=${product?.id}&planId=${selectedPlanId}`;
          break;
        case 'Home':
          targetUrl = `/apply-home?productId=${product?.id}&planId=${selectedPlanId}`;
          break;
        case 'Health':
        case 'Medical':
          targetUrl = `/apply-health?productId=${product?.id}&planId=${selectedPlanId}`;
          break;
        default:
          targetUrl = `/apply-life?productId=${product?.id}&planId=${selectedPlanId}`;
      }

      console.log('🔀 Navigating to:', targetUrl);
      window.location.href = targetUrl;
    } catch (error) {
      console.error('❌ Error saving draft:', error);
      alert('Error saving. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Color themes for each insurance type
  const getColorTheme = () => {
    switch(productType) {
      case 'Life':
        return {
          header: 'from-red-600 to-pink-700',
          headerText: 'text-pink-100',
          result: 'from-red-50 to-pink-50',
          resultBorder: 'border-red-200',
          resultText: 'text-red-600',
          button: 'bg-gradient-to-r from-red-600 to-pink-700 hover:from-red-700 hover:to-pink-800',
          badge: 'bg-red-100 text-red-700'
        };
      case 'Medical':
        return {
          header: 'from-green-600 to-emerald-700',
          headerText: 'text-emerald-100',
          result: 'from-green-50 to-emerald-50',
          resultBorder: 'border-green-200',
          resultText: 'text-green-600',
          button: 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800',
          badge: 'bg-green-100 text-green-700'
        };
      case 'Motor':
        return {
          header: 'from-blue-600 to-indigo-700',
          headerText: 'text-indigo-100',
          result: 'from-blue-50 to-indigo-50',
          resultBorder: 'border-blue-200',
          resultText: 'text-blue-600',
          button: 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800',
          badge: 'bg-blue-100 text-blue-700'
        };
      case 'Home':
        return {
          header: 'from-orange-600 to-red-600',
          headerText: 'text-orange-100',
          result: 'from-orange-50 to-red-50',
          resultBorder: 'border-orange-200',
          resultText: 'text-orange-600',
          button: 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700',
          badge: 'bg-orange-100 text-orange-700'
        };
      default:
        return {
          header: 'from-blue-600 to-blue-700',
          headerText: 'text-blue-100',
          result: 'from-blue-50 to-blue-100',
          resultBorder: 'border-blue-200',
          resultText: 'text-blue-600',
          button: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
          badge: 'bg-blue-100 text-blue-700'
        };
    }
  };

  const colors = getColorTheme();
  const selectedPlan = plans.find(p => p.id === selectedPlanId);

  return (
    <>
      {/* Trigger Button */}
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => setIsOpen(true)}
      >
        <Calculator className="size-4 mr-2" />
        Calculate Premium
      </Button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className={`sticky top-0 bg-gradient-to-r ${colors.header} text-white p-6 rounded-t-xl z-10`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calculator className="size-6" />
                  <div>
                    <h3 className="text-xl font-bold">Premium Calculator</h3>
                    <p className={`text-sm ${colors.headerText}`}>{product?.productName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Body - 2 Column Layout */}
            <div className="p-6">
              {loadingPlans ? (
                <div className="text-center py-12">
                  <div className="animate-spin size-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading insurance plans...</p>
                </div>
              ) : (
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Left Column - Plan Selection & User Profile */}
                  <div className="space-y-6">
                    {/* Plan Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Select Insurance Plan
                      </label>
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                        {plans.map((plan) => (
                          <div
                            key={plan.id}
                            onClick={() => setSelectedPlanId(plan.id)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                              selectedPlanId === plan.id
                                ? `${colors.resultBorder} bg-gradient-to-r ${colors.result}`
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900">{plan.planName}</h4>
                                <p className="text-xs text-gray-500">{plan.planCode}</p>
                              </div>
                              {(plan.isFeatured || plan.isPopular) && (
                                <div className="flex gap-1">
                                  {plan.isFeatured && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
                                      <Sparkles className="size-3" />
                                      Featured
                                    </span>
                                  )}
                                  {plan.isPopular && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                                      <TrendingUp className="size-3" />
                                      Popular
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-gray-600">Coverage</p>
                                <p className="font-semibold">${plan.coverageAmount.toLocaleString()}</p>
                              </div>
                              {plan.termYears > 0 && (
                                <div>
                                  <p className="text-gray-600">Term</p>
                                  <p className="font-semibold">{plan.termYears} years</p>
                                </div>
                              )}
                            </div>
                            <div className="mt-2 pt-2 border-t">
                              <p className="text-xs text-gray-600">Base Premium</p>
                              <p className="text-lg font-bold text-gray-900">${plan.basePremiumAnnual.toLocaleString()}/year</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* User Profile Section */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-900 mb-4">Your Profile</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {/* Age */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Age
                          </label>
                          <input
                            type="number"
                            min="18"
                            max="65"
                            value={age}
                            onChange={(e) => setAge(parseInt(e.target.value) || 18)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        {/* Gender */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gender
                          </label>
                          <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>

                        {/* Health Status */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Health Status
                          </label>
                          <select
                            value={healthStatus}
                            onChange={(e) => setHealthStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Average">Average</option>
                            <option value="Poor">Poor</option>
                          </select>
                        </div>

                        {/* Occupation Risk */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Occupation Risk
                          </label>
                          <select
                            value={occupationRisk}
                            onChange={(e) => setOccupationRisk(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="Low">Low (Office work)</option>
                            <option value="Medium">Medium (Light manual)</option>
                            <option value="High">High (Hazardous)</option>
                          </select>
                        </div>

                        {/* Payment Frequency */}
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Payment Frequency
                          </label>
                          <select
                            value={paymentFrequency}
                            onChange={(e) => setPaymentFrequency(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="LumpSum">Lump Sum (One-time - Save 8%!) ⭐</option>
                            <option value="Annual">Annual (Yearly - Best Value)</option>
                            <option value="Semi-Annual">Semi-Annual (Every 6 months)</option>
                            <option value="Quarterly">Quarterly (Every 3 months)</option>
                            <option value="Monthly">Monthly</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">
                            {paymentFrequency === 'LumpSum' && '💰 8% discount for full payment'}
                            {paymentFrequency === 'Annual' && 'No surcharge - standard rate'}
                            {paymentFrequency === 'Semi-Annual' && '2% surcharge applies'}
                            {paymentFrequency === 'Quarterly' && '3% surcharge applies'}
                            {paymentFrequency === 'Monthly' && '5% surcharge applies'}
                          </p>
                        </div>
                      </div>

                      {/* Calculate Button */}
                      <Button 
                        onClick={handleCalculate}
                        disabled={!selectedPlanId || isCalculating}
                        className={`w-full mt-4 ${colors.button}`}
                      >
                        {isCalculating ? (
                          <>
                            <div className="animate-spin size-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Calculating...
                          </>
                        ) : (
                          <>
                            <Calculator className="size-4 mr-2" />
                            Calculate Premium
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Right Column - Results & Plan Details */}
                  <div className="space-y-4">
                    {/* Calculation Results */}
                    {calculationResult ? (
                      <div className={`p-6 bg-gradient-to-br ${colors.result} rounded-xl border-2 ${colors.resultBorder}`}>
                        <div className="text-center mb-4">
                          <p className="text-sm text-gray-600 mb-2">
                            {calculationResult.paymentFrequency === 'LumpSum' ? 'One-time Payment' : `${calculationResult.paymentFrequency} Premium`}
                          </p>
                          <p className={`text-5xl font-bold ${colors.resultText} mb-2`}>
                            ${calculationResult.calculatedPremium.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            for {selectedPlan?.planName}
                          </p>
                        </div>

                        {/* Applied Factors */}
                        <div className="mb-4 p-3 bg-white/50 rounded-lg">
                          <h5 className="text-xs font-semibold text-gray-700 mb-2">Premium Factors Applied:</h5>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-gray-600">Age Multiplier:</span>
                              <span className="font-semibold ml-1">{calculationResult.appliedFactors.ageMultiplier}x</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Gender:</span>
                              <span className="font-semibold ml-1">{calculationResult.appliedFactors.genderMultiplier}x</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Health:</span>
                              <span className="font-semibold ml-1">{calculationResult.appliedFactors.healthMultiplier}x</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Occupation:</span>
                              <span className="font-semibold ml-1">{calculationResult.appliedFactors.occupationMultiplier}x</span>
                            </div>
                          </div>
                        </div>

                        {/* Benefits */}
                        {calculationResult.benefits && (
                          <div className="mb-4 p-3 bg-white/50 rounded-lg">
                            <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                              <CheckCircle2 className="size-4" />
                              Plan Benefits:
                            </h5>
                            <ul className="space-y-1 text-xs text-gray-700">
                              {calculationResult.benefits.accidentalDeathBenefit > 0 && (
                                <li>• Accidental Death: ${calculationResult.benefits.accidentalDeathBenefit.toLocaleString()}</li>
                              )}
                              {calculationResult.benefits.disabilityBenefit > 0 && (
                                <li>• Disability: ${calculationResult.benefits.disabilityBenefit.toLocaleString()}</li>
                              )}
                              {calculationResult.benefits.criticalIllnessBenefit > 0 && (
                                <li>• Critical Illness: ${calculationResult.benefits.criticalIllnessBenefit.toLocaleString()}</li>
                              )}
                            </ul>
                          </div>
                        )}

                        <div className="mb-4 pt-3 border-t border-gray-300">
                          <div className="flex items-start gap-2 text-xs text-gray-600">
                            <Info className="size-4 flex-shrink-0 mt-0.5" />
                            <p>
                              This is an estimated premium. Final premium may vary based on medical checkup and underwriting.
                            </p>
                          </div>
                        </div>

                        <Button
                          onClick={handleProceedToApply}
                          disabled={isSaving}
                          className={`w-full ${colors.button}`}
                        >
                          {isSaving ? 'Saving...' : 'Proceed to Apply'}
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 p-12 border-2 border-dashed border-gray-200 rounded-xl">
                        <Calculator className="size-16 mx-auto mb-4 opacity-50" />
                        <p className="text-sm">Select a plan and enter your details</p>
                        <p className="text-xs text-gray-400 mt-1">Then click Calculate to see your premium</p>
                      </div>
                    )}

                    {/* Selected Plan Details */}
                    {selectedPlan && !calculationResult && (
                      <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                          <Info className="size-4" />
                          {selectedPlan.planName} Details
                        </h4>
                        <div className="space-y-2 text-sm text-blue-700">
                          <p><strong>Coverage:</strong> ${selectedPlan.coverageAmount.toLocaleString()}</p>
                          {selectedPlan.termYears > 0 && (
                            <p><strong>Term:</strong> {selectedPlan.termYears} years</p>
                          )}
                          <p><strong>Base Premium:</strong> ${selectedPlan.basePremiumAnnual.toLocaleString()}/year</p>
                          {selectedPlan.requiresMedicalExam && (
                            <p className="text-xs text-amber-600">⚕️ Medical exam required</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-xl border-t flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setCalculationResult(null);
                  setAge(30);
                  setGender('Male');
                  setHealthStatus('Good');
                  setOccupationRisk('Low');
                  setPaymentFrequency('Annual');
                }}
              >
                Reset
              </Button>
              <Button 
                className="flex-1"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

