import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Shield, Heart, TrendingUp, CheckCircle2, CheckCircle, X,
  Users, DollarSign, Calendar, FileText,
  AlertCircle, Info, ArrowRight, Star, Gift,
  Phone, Mail, MessageCircle, Download,
  Clock, Award, Target, Zap, Percent,
  Building2, Home, Car, Hospital, BriefcaseMedical,
  CircleDollarSign, Banknote, Wallet, CreditCard,
  UserCheck, Baby, GraduationCap, Briefcase,
  FileCheck, ClipboardCheck, FileSignature, Timer,
  PieChart, BarChart3, Receipt, Calculator,
  ChevronDown, ChevronUp, Wrench
} from 'lucide-react';
import axios from '../../api/axios';
import plansService, { calculatePlanPremium } from '../../api/services/plansService';
import productsService from '../../api/services/productsService';

export function MotorInsuranceProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPaymentFrequency, setSelectedPaymentFrequency] = useState('Annual');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [calculatingPrices, setCalculatingPrices] = useState(false);
  const [planPrices, setPlanPrices] = useState({});

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Custom plan state
  const [showCustomPlan, setShowCustomPlan] = useState(false);
  const [customCoverage, setCustomCoverage] = useState(250000);
  const [customTerm, setCustomTerm] = useState('20');
  const [customPaymentFrequency, setCustomPaymentFrequency] = useState('Annual');
  const [customPremium, setCustomPremium] = useState(null);
  const [calculatingCustom, setCalculatingCustom] = useState(false);
  const [termError, setTermError] = useState('');

  // Dynamic ranges based on current product's plans
  const coverageRange = plans.length > 0 ? {
    min: Math.min(...plans.map(p => p.coverageAmount)),
    max: Math.max(
      Math.max(...plans.map(p => p.coverageAmount)) * 1.5, // 50% more than max plan
      500000 // Minimum allowed max of $500K
    ),
    step: 5000
  } : { min: 100000, max: 1000000, step: 5000 };

  const termRange = plans.length > 0 ? {
    min: Math.min(...plans.map(p => p.termLength || p.termYears)),
    max: Math.max(...plans.map(p => p.termLength || p.termYears))
  } : { min: 10, max: 30 };

  useEffect(() => {
    loadProductDetails();
  }, [id]);

  // Handle hash scrolling for #plans
  useEffect(() => {
    if (location.hash === '#plans') {
      setActiveTab('plans');
      setTimeout(() => {
        const element = document.getElementById('plans-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    }
  }, [location.hash]);

  // Smooth scroll to top when tab changes
  useEffect(() => {
    // Scroll to the tabs list wrapper
    const tabsListWrapper = document.getElementById('tabs-list-wrapper');
    if (tabsListWrapper) {
      // Get the sticky bar height to offset the scroll
      const stickyBar = document.querySelector('.sticky.top-0.z-40');
      const stickyBarHeight = stickyBar ? stickyBar.offsetHeight : 0;

      const elementPosition = tabsListWrapper.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - stickyBarHeight - 20; // 20px extra padding

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, [activeTab]);

  const loadProductDetails = async () => {
    try {
      setLoading(true);

      // Load product details
      const productResponse = await axios.get(`/api/products/${id}`);
      console.log('🎯 Product Response:', productResponse);
      console.log('💰 Response Data:', productResponse?.data);

      // Extract product from response (handle both direct and nested structure)
      const productData = productResponse?.data?.data || productResponse?.data || productResponse?.product || productResponse;
      console.log('📝 Product Data:', productData);
      console.log('✨ Product Name:', productData?.productName);
      console.log('💵 Fee Fields:', {
        processingFee: productData?.processingFee,
        policyIssuanceFee: productData?.policyIssuanceFee,
        medicalCheckupFee: productData?.medicalCheckupFee,
        adminFee: productData?.adminFee
      });
      setProduct(productData);

      // Load plans
      const plansData = await plansService.getPlansByProduct(id);
      setPlans(plansData || []);
      if (plansData && plansData.length > 0) {
        setSelectedPlan(plansData[0]);
        // Set default custom coverage to middle plan's coverage
        const sortedByAmount = [...plansData].sort((a, b) => a.coverageAmount - b.coverageAmount);
        const middleIndex = Math.floor(sortedByAmount.length / 2);
        const defaultCoverage = sortedByAmount[middleIndex]?.coverageAmount || 250000;
        const defaultTerm = sortedByAmount[middleIndex]?.termLength || sortedByAmount[middleIndex]?.termYears || 20;
        setCustomCoverage(defaultCoverage);
        setCustomTerm(defaultTerm.toString());
      }

      // Load related products (other Life Insurance products)
      try {
        const relatedResponse = await productsService.getProductsByType('Life');

        // Handle different response structures
        let allProducts = [];
        if (Array.isArray(relatedResponse)) {
          allProducts = relatedResponse;
        } else if (Array.isArray(relatedResponse?.data)) {
          allProducts = relatedResponse.data;
        } else if (Array.isArray(relatedResponse?.products)) {
          allProducts = relatedResponse.products;
        } else if (Array.isArray(relatedResponse?.$values)) {
          allProducts = relatedResponse.$values;
        }

        const related = allProducts.filter(p => p.id !== parseInt(id)).slice(0, 3);
        console.log('✅ Related Products:', related);
        setRelatedProducts(related);
      } catch (err) {
        console.error('❌ Error loading related products:', err);
        setRelatedProducts([]);
      }
    } catch (error) {
      console.error('❌ Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate premium for a plan using actual API
  const calculatePlanPremium = async (planId, frequency) => {
    try {
      const response = await axios.post('/api/plans/calculate', {
        planId: planId,
        age: 30, // Default values for display
        gender: 'Male',
        healthStatus: 'Good',
        occupationRisk: 'Low',
        paymentFrequency: frequency
      });
      return response.calculatedPremium;
    } catch (error) {
      console.error('Error calculating premium:', error);
      return null;
    }
  };

  // Validate term length
  const validateTerm = (value) => {
    const termNum = parseInt(value);
    if (isNaN(termNum) || value.trim() === '') {
      setTermError('Please enter a valid number');
      return false;
    }
    if (termNum < 1) {
      setTermError('Term must be at least 1 year');
      return false;
    }
    if (termNum > 40) {
      setTermError('Term cannot exceed 40 years');
      return false;
    }

    // Check if term is available in any plan
    if (plans.length > 0) {
      const availableTerms = [...new Set(plans.map(p => p.termLength))];
      const minTerm = Math.min(...availableTerms);
      const maxTerm = Math.max(...availableTerms);

      if (termNum < minTerm || termNum > maxTerm) {
        setTermError(`Term must be between ${minTerm} and ${maxTerm} years for this product`);
        return false;
      }
    }

    setTermError('');
    return true;
  };

  const handleTermChange = (e) => {
    const value = e.target.value;
    setCustomTerm(value);
    if (value.trim() !== '') {
      validateTerm(value);
    } else {
      setTermError('');
    }
  };

  // Calculate custom plan premium
  const calculateCustomPremium = async () => {
    if (!product || plans.length === 0) return;

    // Validate term before calculating
    if (!validateTerm(customTerm)) {
      return;
    }

    setCalculatingCustom(true);
    setCustomPremium(null);

    try {
      // Smart base plan selection - find closest match to custom values
      const targetCoverage = customCoverage;
      const targetTerm = parseInt(customTerm);

      // Find plan with closest coverage and term
      let closestPlan = plans[0];
      let minDifference = Infinity;

      for (const plan of plans) {
        const coverageDiff = Math.abs((plan.coverageAmount || 0) - targetCoverage);
        const termDiff = Math.abs((plan.termLength || plan.termYears || 0) - targetTerm) * 10000; // Weight term less
        const totalDiff = coverageDiff + termDiff;

        if (totalDiff < minDifference) {
          minDifference = totalDiff;
          closestPlan = plan;
        }
      }

      const basePlanId = closestPlan?.insurancePlanId || closestPlan?.id;

      if (!basePlanId) {
        console.error('No valid plan ID found');
        setCustomPremium(null);
        return;
      }

      console.log('Calculating with closest plan:', closestPlan.planName, 'planId:', basePlanId, 'coverage:', customCoverage, 'term:', customTerm);

      const response = await axios.post('/api/plans/calculate', {
        planId: basePlanId,
        customCoverageAmount: customCoverage,
        customTermLength: parseInt(customTerm),
        age: 30, // Default values for display
        gender: 'Male',
        healthStatus: 'Good',
        occupationRisk: 'Low',
        paymentFrequency: customPaymentFrequency
      });

      setCustomPremium(response.calculatedPremium);
    } catch (error) {
      console.error('Error calculating custom premium:', error);
      setCustomPremium(null);
    } finally {
      setCalculatingCustom(false);
    }
  };

  const handleApplyCustomPlan = () => {
    if (!customPremium || !product || !validateTerm(customTerm)) return;

    // Map payment frequency to URL format
    const frequencyMap = {
      'Monthly': 'monthly',
      'Quarterly': 'quarterly',
      'Semi-Annual': 'semi-annual',
      'Annual': 'annual',
      'LumpSum': 'single'
    };
    const urlFrequency = frequencyMap[customPaymentFrequency] || 'annual';

    navigate(`/apply-motor?productId=${product.insuranceProductId}&coverage=${customCoverage}&term=${parseInt(customTerm)}&frequency=${urlFrequency}&premium=${customPremium}&custom=true`);
  };

  // Load prices for all plans when frequency changes
  useEffect(() => {
    const loadPlanPrices = async () => {
      if (plans.length === 0) return;

      setCalculatingPrices(true);
      const prices = {};

      for (const plan of plans) {
        const price = await calculatePlanPremium(plan.id, selectedPaymentFrequency);
        if (price) {
          prices[plan.id] = price;
        }
      }

      setPlanPrices(prices);
      setCalculatingPrices(false);
    };

    loadPlanPrices();
  }, [plans, selectedPaymentFrequency]);

  const handleApplyNow = async (planId = null) => {
    const targetPlanId = planId || selectedPlan?.id;
    const targetPlan = plans.find(p => p.id === targetPlanId);

    // Show age requirement alert for unauthenticated users
    if (targetPlan && (targetPlan.minAge > 18 || targetPlan.maxAge < 65)) {
      const ageRequirement = `This plan is available for ages ${targetPlan.minAge}-${targetPlan.maxAge}. Please ensure you meet the age requirements when applying.`;
      console.log('⚠️ Age requirement alert:', ageRequirement);
    }

    // Map frequency format for backend
    const frequencyMap = {
      'monthly': 'Monthly',
      'quarterly': 'Quarterly',
      'semi-annual': 'Semi-Annual',
      'annual': 'Annual',
      'single': 'LumpSum'
    };
    const mappedFrequency = frequencyMap[selectedPaymentFrequency] || 'Annual';

    // Save selection to localStorage (for non-authenticated users or page refresh)
    // NOTE: Premium will be calculated in Step 3 with user's actual age/health data
    const selectionData = {
      productId: id,
      planId: targetPlanId,
      type: 'Motor',
      applicationType: 'MotorInsurance',
      paymentFrequency: mappedFrequency,
      timestamp: Date.now(),
      source: 'product-detail',
      planMinAge: targetPlan?.minAge,
      planMaxAge: targetPlan?.maxAge,
      planName: targetPlan?.planName,
      coverageAmount: targetPlan?.coverageAmount,
      termYears: targetPlan?.termYears
    };
    console.log('💾 Saving plan selection to localStorage:', selectionData);
    localStorage.setItem('calculatorParams', JSON.stringify(selectionData));

    // Navigate WITHOUT premium in URL - premium will be auto-calculated in Step 3
    // This ensures accurate pricing based on user's actual age, gender, and health status
    navigate(`/apply-motor?productId=${id}&planId=${targetPlanId}&frequency=${selectedPaymentFrequency}`);
  };

  const handleGetQuote = () => {
    // Scroll to Plans tab
    setActiveTab('plans');
    // Smooth scroll to the tab content
    setTimeout(() => {
      const element = document.getElementById('plans-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin size-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="size-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/motor-insurance">Back to Motor Insurance</Link>
          </Button>
        </div>
      </div>
    );
  }

  const features = product.features?.split('|') || [];

  const keyBenefits = [
    {
      icon: Shield,
      title: 'Complete Vehicle Protection',
      description: 'Coverage for accidents, theft, and third-party damages'
    },
    {
      icon: Car,
      title: '24/7 Roadside Assistance',
      description: 'Emergency support anytime, anywhere you need it'
    },
    {
      icon: TrendingUp,
      title: 'No Claim Bonus',
      description: 'Up to 50% discount on renewal for claim-free years'
    },
    {
      icon: Zap,
      title: 'Fast Claims Settlement',
      description: 'Quick and hassle-free claim processing within 7 days'
    }
  ];

  const coverageScope = [
    {
      category: 'Own Damage Coverage',
      items: [
        { name: 'Accident Damage', covered: true, details: 'Repairs for collision and accidents' },
        { name: 'Fire & Explosion', covered: true, details: 'Full coverage for fire-related damages' },
        { name: 'Theft & Burglary', covered: true, details: 'Complete vehicle theft protection' },
        { name: 'Natural Disasters', covered: true, details: 'Flood, earthquake, storm, lightning' },
        { name: 'Vandalism', covered: true, details: 'Malicious damage by third parties' },
      ]
    },
    {
      category: 'Third-Party Liability',
      items: [
        { name: 'Third-Party Death', covered: true, details: 'Unlimited liability coverage' },
        { name: 'Third-Party Injury', covered: true, details: 'Medical expenses up to policy limit' },
        { name: 'Third-Party Property', covered: true, details: 'Damage to other vehicles/property' },
        { name: 'Legal Defense Costs', covered: true, details: 'Court and lawyer fees covered' },
        { name: 'Passenger Liability', covered: true, details: 'Injury to passengers in your vehicle' },
      ]
    },
    {
      category: 'Personal Accident Cover',
      items: [
        { name: 'Driver Death', covered: true, details: 'Lump sum payment to family' },
        { name: 'Permanent Disability', covered: true, details: 'Compensation based on disability percentage' },
        { name: 'Temporary Disability', covered: true, details: 'Weekly payments during recovery' },
        { name: 'Medical Expenses', covered: true, details: 'Hospital and treatment costs' },
      ]
    },
    {
      category: 'Add-On Covers',
      items: [
        { name: 'Zero Depreciation', covered: true, details: 'Full claim without depreciation deduction' },
        { name: 'Engine Protection', covered: true, details: 'Water damage and engine repairs' },
        { name: 'Roadside Assistance', covered: true, details: 'Towing, fuel, battery, tire services' },
        { name: 'Return to Invoice', covered: true, details: 'Original car value in case of total loss' },
        { name: 'NCB Protection', covered: true, details: 'Retain no-claim bonus after 1 claim' },
      ]
    }
  ];

  const exclusions = [
    {
      category: 'Driver-Related Exclusions',
      items: [
        'Driving without valid license or permit',
        'Driving under influence of alcohol or drugs',
        'Driver under legal driving age',
        'Unlicensed or unauthorized driver',
        'Racing, speed testing, or competitions',
        'Using vehicle for hire without commercial insurance',
      ]
    },
    {
      category: 'Damage Not Covered',
      items: [
        'Wear and tear, mechanical/electrical breakdown',
        'Consequential loss (loss of use, depreciation)',
        'Damage to tires (unless vehicle is also damaged)',
        'Manufacturing defects or warranty issues',
        'Pre-existing damage not disclosed',
        'Intentional damage by insured',
      ]
    },
    {
      category: 'Geographical & Usage Exclusions',
      items: [
        'War, invasion, terrorism, civil unrest',
        'Nuclear radiation or radioactive contamination',
        'Use outside geographical limits',
        'Commercial use with private policy',
        'Illegal activities or criminal acts',
      ]
    },
    {
      category: 'Administrative Exclusions',
      items: [
        'Claims after policy expiry or lapse',
        'Non-payment of premium dues',
        'Delayed claim reporting (beyond 48 hours)',
        'Non-disclosure or misrepresentation of facts',
        'Vehicle modifications not informed to insurer',
        'No valid registration, fitness, or permit',
      ]
    }
  ];

  const claimsProcess = [
    {
      step: 1,
      title: 'Immediate Action',
      description: 'Secure the accident scene',
      details: 'Ensure safety, call police if required, take photos, exchange information',
      timeline: 'Immediately',
      icon: Phone
    },
    {
      step: 2,
      title: 'Notify Insurer',
      description: 'Report within 48 hours',
      details: 'Call helpline, provide accident details, get claim reference number',
      timeline: 'Within 48 hours',
      icon: FileText
    },
    {
      step: 3,
      title: 'Vehicle Inspection',
      description: 'Surveyor assesses damage',
      details: 'Take vehicle to garage, surveyor inspects and estimates repair costs',
      timeline: '1-3 days',
      icon: ClipboardCheck
    },
    {
      step: 4,
      title: 'Submit Documents',
      description: 'Complete paperwork',
      details: 'FIR copy, license, RC, policy, photos, repair bills, surveyor report',
      timeline: '3-5 days',
      icon: FileCheck
    },
    {
      step: 5,
      title: 'Claim Settlement',
      description: 'Payment or cashless repair',
      details: 'Reimbursement to account or direct payment to garage',
      timeline: '5-7 days',
      icon: Banknote
    }
  ];

  const whoShouldBuy = [
    {
      icon: Car,
      title: 'All Vehicle Owners',
      description: 'Mandatory by law for all motor vehicles',
      reason: 'Legal requirement with third-party liability coverage'
    },
    {
      icon: Briefcase,
      title: 'Daily Commuters',
      description: 'Use vehicle regularly for work and personal travel',
      reason: 'Protect against daily risks on the road'
    },
    {
      icon: Home,
      title: 'New Car Owners',
      description: 'Recently purchased vehicle with loan',
      reason: 'Comprehensive coverage protects your investment'
    },
    {
      icon: TrendingUp,
      title: 'High-Value Vehicle Owners',
      description: 'Luxury or expensive cars requiring full protection',
      reason: 'Minimize financial loss from accidents or theft'
    },
    {
      icon: Users,
      title: 'Family Vehicle Users',
      description: 'Multiple drivers including young or inexperienced',
      reason: 'Coverage for all family members driving the vehicle'
    },
    {
      icon: UserCheck,
      title: 'Commercial Vehicle Owners',
      description: 'Businesses with fleet or delivery vehicles',
      reason: 'Business continuity and liability protection'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ArrowRight className="size-3.5 text-gray-400" />
            <Link to="/motor-insurance" className="text-gray-500 hover:text-blue-600 transition-colors">
              Motor Insurance
            </Link>
            <ArrowRight className="size-3.5 text-gray-400" />
            <span className="text-gray-900 font-medium">
              {product?.productName || 'Product Details'}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
                  {product?.productCode || 'LIFE-001'}
                </Badge>
                <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                  {product?.productName || 'Life Insurance Product'}
                </h1>
                <p className="text-lg md:text-xl text-blue-100 mb-6 leading-relaxed">
                  {product?.description || 'Comprehensive life insurance coverage for you and your family'}
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-lg hover:bg-white/20 transition-colors">
                    <Star className="size-5 text-yellow-300 fill-yellow-300" />
                    <span className="font-semibold">4.8/5</span>
                    <span className="text-blue-100 text-sm">(1,245 reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-lg hover:bg-white/20 transition-colors">
                    <Users className="size-5" />
                    <span className="font-semibold">50,000+</span>
                    <span className="text-blue-100 text-sm">policyholders</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-lg hover:bg-white/20 transition-colors">
                    <Shield className="size-5" />
                    <span className="font-semibold">98.5%</span>
                    <span className="text-blue-100 text-sm">claim settlement</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300">
                  <Shield className="size-16 mx-auto mb-3 text-blue-200" />
                  <p className="text-sm text-blue-100 mb-1">Coverage up to</p>
                  <p className="text-3xl font-bold">$500K</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick CTA Bar */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
              <h3 className="font-semibold text-gray-900 line-clamp-1">
                {product?.productName || 'Life Insurance Product'}
              </h3>
              {selectedPlan && (
                <Badge variant="secondary" className="hidden md:inline-flex">
                  From ${selectedPlan.basePremiumMonthly}/month
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
                <Download className="size-4" />
                <span>Brochure</span>
              </Button>
              <Button size="sm" onClick={handleGetQuote} className="gap-2 cursor-pointer">
                <FileCheck className="size-4" />
                <span>Get Quote</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12" id="tabs-container">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            {/* Responsive Tabs - Scrollable on mobile */}
            <div className="overflow-x-auto pb-2 -mx-4 px-4" id="tabs-list-wrapper">
              <TabsList className="inline-flex w-auto min-w-full lg:grid lg:grid-cols-8 gap-1 lg:gap-2">
                <TabsTrigger value="overview" className="whitespace-nowrap">Overview</TabsTrigger>
                <TabsTrigger value="plans" className="whitespace-nowrap">Plans</TabsTrigger>
                <TabsTrigger value="coverage" className="whitespace-nowrap">Coverage</TabsTrigger>
                <TabsTrigger value="exclusions" className="whitespace-nowrap">Exclusions</TabsTrigger>
                <TabsTrigger value="claims" className="whitespace-nowrap">Claims</TabsTrigger>
                <TabsTrigger value="premium" className="whitespace-nowrap">Premium</TabsTrigger>
                <TabsTrigger value="eligibility" className="whitespace-nowrap">Eligibility</TabsTrigger>
                <TabsTrigger value="faq" className="whitespace-nowrap">FAQ</TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8 animate-in fade-in-50 duration-500">
              {/* Key Benefits Grid */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="size-6 text-blue-600" />
                    Why Choose {product.productName}?
                  </CardTitle>
                  <CardDescription>
                    Comprehensive protection designed for your peace of mind
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {keyBenefits.map((benefit, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="size-12 rounded-lg bg-blue-100 flex items-center justify-center">
                            <benefit.icon className="size-6 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                          <p className="text-sm text-gray-600">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Product Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="size-6 text-blue-600" />
                    Product Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {features.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature.trim()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Lifetime coverage with guaranteed death benefit</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Cash value accumulation with guaranteed growth</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Flexible premium payment options</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Tax-advantaged benefits under current law</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Policy loans available against cash value</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Accelerated death benefit for terminal illness</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Coverage continues as long as premiums are paid</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Optional riders for additional protection</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Fees & Charges */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="size-6 text-blue-600" />
                    Fees & Charges
                  </CardTitle>
                  <CardDescription>
                    Transparent pricing with no hidden costs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Processing Fee</span>
                        <span className="font-semibold text-gray-900">
                          ${product.processingFee ? Number(product.processingFee).toFixed(2) : '50.00'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Policy Issuance Fee</span>
                        <span className="font-semibold text-gray-900">
                          ${product.policyIssuanceFee ? Number(product.policyIssuanceFee).toFixed(2) : '100.00'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Medical Checkup Fee</span>
                        <span className="font-semibold text-gray-900">
                          ${product.medicalCheckupFee ? Number(product.medicalCheckupFee).toFixed(2) : '250.00'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Admin Fee (Annual)</span>
                        <span className="font-semibold text-gray-900">
                          ${product.adminFee ? Number(product.adminFee).toFixed(2) : '40.00'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="py-3 px-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-start gap-2 mb-2">
                          <CheckCircle2 className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-green-900 text-sm">One-time Fees</p>
                            <p className="text-xs text-green-700 mt-0.5">Processing and issuance fees are charged only once when you purchase the policy</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-3 px-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-2">
                          <Info className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-blue-900">Premium rates vary by payment frequency. Each plan has dedicated base rates for Monthly, Quarterly, Semi-Annual, Annual, and Lump Sum payments.</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-3 px-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="size-4 text-orange-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-orange-900">Medical checkup fee only applies if health screening is required for your selected plan</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Plans & Pricing Tab */}
            <TabsContent value="plans" id="plans-section" className="space-y-8 animate-in fade-in-50 duration-500">

              {/* Header - Simple style like Schemes.jsx */}
              <div className="text-center mb-12">
                <Badge className="mb-4">Available Plans</Badge>
                <h2 className="mb-4">Life Insurance Plans</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Choose your payment frequency and compare plans. Prices shown are personalized for age 30, good health, low-risk occupation.
                </p>
              </div>

              {/* Payment Frequency Selector */}
              <div className="mb-12">
                <div className="text-center mb-6">
                  <p className="text-gray-600">
                    Choose how often you'd like to pay your premiums
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {[
                    { value: 'Monthly', label: 'Monthly' },
                    { value: 'Quarterly', label: 'Quarterly' },
                    { value: 'Semi-Annual', label: 'Semi-Annual' },
                    { value: 'Annual', label: 'Annual' },
                    { value: 'LumpSum', label: 'Lump Sum' }
                  ].map((freq) => (
                    <Button
                      key={freq.value}
                      type="button"
                      variant={selectedPaymentFrequency === freq.value ? 'default' : 'outline'}
                      onClick={() => setSelectedPaymentFrequency(freq.value)}
                      disabled={calculatingPrices}
                      className={`cursor-pointer ${selectedPaymentFrequency === freq.value
                        ? '!bg-purple-600 hover:!bg-purple-700 !text-white !border-purple-600'
                        : ''} ${calculatingPrices ? 'cursor-not-allowed' : ''}`}
                    >
                      {freq.label}
                    </Button>
                  ))}
                </div>
                {calculatingPrices && (
                  <p className="text-center text-sm text-gray-600 mt-3">Calculating premiums...</p>
                )}
              </div>

              {/* Payment Frequency Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2 text-xs text-blue-900">
                  <Info className="size-4 text-blue-600 flex-shrink-0" />
                  <span className="font-semibold">Payment Frequency:</span>
                  <span>Monthly <span className="text-red-600 font-medium">+5%</span></span>
                  <span className="text-blue-300">•</span>
                  <span>Quarterly <span className="text-orange-600 font-medium">+3%</span></span>
                  <span className="text-blue-300">•</span>
                  <span>Semi-Annual <span className="text-orange-600 font-medium">+2%</span></span>
                  <span className="text-blue-300">•</span>
                  <span>Annual <span className="text-gray-600 font-medium">Base</span></span>
                  <span className="text-blue-300">•</span>
                  <span>Lump Sum <span className="text-green-600 font-medium">-8%</span></span>
                </div>
              </div>

              {/* Important Note */}
              <Alert className="bg-blue-50 border-blue-200 mb-6">
                <Info className="size-4 text-blue-600" />
                <AlertDescription className="text-xs text-blue-800">
                  <strong>Note:</strong> Estimated premium based on standard profile (Age 30, Male, Good Health, Low Risk). Final rate determined after application review.
                </AlertDescription>
              </Alert>

              {/* Plans Section */}
              <div className="text-center mb-8">
                <p className="text-gray-600">
                  Compare coverage options and select the plan that fits your needs
                </p>
              </div>

              {/* Plans Grid - Clean style like Schemes.jsx */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {plans.map((plan, index) => {
                  const isSelected = selectedPlan?.id === plan.id;
                  const isPopular = plan.isPopular;
                  const calculatedPrice = planPrices[plan.id];

                  return (
                    <Card
                      key={`plan-${plan.id}`}
                      className={`hover:shadow-lg transition-shadow ${isPopular ? 'border-2 border-purple-500' : ''
                        }`}
                    >
                      <CardHeader>
                        {isPopular && (
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
                            {calculatingPrices || !calculatedPrice ? (
                              <div className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-20 mx-auto mb-2"></div>
                                <div className="h-6 bg-gray-200 rounded w-24 mx-auto"></div>
                              </div>
                            ) : (
                              <>
                                <p className="text-xs text-gray-600 mb-1">Your Premium</p>
                                <p className="text-2xl font-bold text-purple-600">
                                  ${Math.round(calculatedPrice).toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  per {selectedPaymentFrequency === 'LumpSum' ? 'policy' :
                                    selectedPaymentFrequency === 'Monthly' ? 'month' :
                                      selectedPaymentFrequency === 'Quarterly' ? 'quarter' :
                                        selectedPaymentFrequency === 'Semi-Annual' ? '6 months' : 'year'}
                                </p>
                                {selectedPaymentFrequency !== 'Annual' && (() => {
                                  // Calculate base (Annual) and adjustment
                                  const adjustmentRate =
                                    selectedPaymentFrequency === 'LumpSum' ? -0.08 :
                                      selectedPaymentFrequency === 'Monthly' ? 0.05 :
                                        selectedPaymentFrequency === 'Quarterly' ? 0.03 : 0.02;

                                  const basePremium = Math.round(calculatedPrice / (1 + adjustmentRate));
                                  const adjustmentAmount = Math.round(calculatedPrice - basePremium);
                                  const sign = adjustmentAmount >= 0 ? '+' : '';

                                  return (
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                      <div className="text-xs space-y-1">
                                        <div className="flex justify-between text-gray-600">
                                          <span>Base (Annual):</span>
                                          <span className="font-medium">${basePremium.toLocaleString()}</span>
                                        </div>
                                        <div className={`flex justify-between font-medium ${selectedPaymentFrequency === 'LumpSum' ? 'text-green-600' :
                                          selectedPaymentFrequency === 'Monthly' ? 'text-red-600' : 'text-orange-600'
                                          }`}>
                                          <span>
                                            {selectedPaymentFrequency === 'LumpSum' ? 'Discount (-8%):' :
                                              selectedPaymentFrequency === 'Monthly' ? 'Surcharge (+5%):' :
                                                selectedPaymentFrequency === 'Quarterly' ? 'Surcharge (+3%):' :
                                                  'Surcharge (+2%):'}
                                          </span>
                                          <span>{sign}${Math.abs(adjustmentAmount).toLocaleString()}</span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </>
                            )}
                          </div>

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
                              {plan.disabilityBenefit > 0 && (
                                <li className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="size-4 text-green-500 flex-shrink-0 mt-0.5" />
                                  <span>${(plan.disabilityBenefit / 1000).toLocaleString()}k disability protection</span>
                                </li>
                              )}
                              {plan.includesMaternityBenefit && (
                                <li className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="size-4 text-green-500 flex-shrink-0 mt-0.5" />
                                  <span>Maternity benefits included</span>
                                </li>
                              )}
                              {plan.includesRiderOptions && (
                                <li className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="size-4 text-green-500 flex-shrink-0 mt-0.5" />
                                  <span>Optional riders available</span>
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

                          {/* Apply Button - Simple style like Schemes.jsx */}
                          <div className="pt-3 border-t">
                            <Button
                              className="w-full cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();

                                // Map payment frequency to URL format
                                const frequencyMap = {
                                  'Monthly': 'monthly',
                                  'Quarterly': 'quarterly',
                                  'Semi-Annual': 'semi-annual',
                                  'Annual': 'annual',
                                  'LumpSum': 'single'
                                };
                                const urlFrequency = frequencyMap[selectedPaymentFrequency] || 'annual';

                                // Get calculated premium for this plan
                                const premium = planPrices[plan.id] || 0;

                                // Navigate to application with query params
                                navigate(`/apply-motor?productId=${product.id}&planId=${plan.id}&frequency=${urlFrequency}&premium=${Math.round(premium)}`);
                              }}
                            >
                              Apply Now <ArrowRight className="size-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Customize Your Plan Section */}
              <Card className="mt-8 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-purple-900">Need Different Coverage?</CardTitle>
                      <CardDescription>Customize your plan to match your exact needs</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={true}
                      className="!text-gray-400 !bg-gray-100 !cursor-not-allowed border border-gray-200"
                    >
                      Maintenance <Wrench className="size-4 ml-2" />
                    </Button>
                  </div>
                </CardHeader>
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center gap-2">
                    <Info className="size-4 text-gray-400" />
                    This feature is currently under maintenance. Please select a standard plan above.
                  </p>
                </div>

                {showCustomPlan && (
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Left Column - Configuration */}
                      <div className="space-y-6">
                        {/* Coverage Amount Slider */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-gray-700">
                              Coverage Amount
                            </label>
                            <Badge variant="secondary" className="text-base font-bold text-purple-700">
                              ${(customCoverage / 1000).toFixed(0)}K
                            </Badge>
                          </div>
                          <input
                            type="range"
                            min={coverageRange.min}
                            max={coverageRange.max}
                            step={coverageRange.step}
                            value={customCoverage}
                            onChange={(e) => setCustomCoverage(parseInt(e.target.value))}
                            className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>${(coverageRange.min / 1000).toFixed(0)}K</span>
                            <span>${(coverageRange.max / 1000).toFixed(0)}K</span>
                          </div>
                          <p className="text-xs text-gray-600 italic">
                            Choose the death benefit amount your beneficiaries will receive. Range based on this product's available plans (up to 50% higher than maximum plan).
                          </p>
                        </div>

                        {/* Term Length Input */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-semibold text-gray-700">
                              Term Length (Years)
                            </label>
                            {plans.length > 0 && (
                              <span className="text-xs text-gray-500">
                                Range: {termRange.min}-{termRange.max} years
                              </span>
                            )}
                          </div>
                          <input
                            type="number"
                            min={termRange.min}
                            max={termRange.max}
                            value={customTerm}
                            onChange={handleTermChange}
                            className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 ${termError
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                              : 'border-purple-200 focus:border-purple-500 focus:ring-purple-200'
                              }`}
                            placeholder="Enter term length"
                          />
                          {termError && (
                            <div className="flex items-start gap-2 text-red-600 text-xs">
                              <AlertCircle className="size-4 flex-shrink-0 mt-0.5" />
                              <span>{termError}</span>
                            </div>
                          )}
                          {!termError && plans.length > 0 && (() => {
                            const uniqueTerms = [...new Set(plans.map(p => p.termLength).filter(t => t != null && !isNaN(t)))].sort((a, b) => a - b);
                            if (uniqueTerms.length > 0) {
                              return (
                                <div className="flex flex-wrap gap-2">
                                  <span className="text-xs text-gray-500">Quick select:</span>
                                  {uniqueTerms.map((term, idx) => (
                                    <button
                                      key={`term-${term}-${idx}`}
                                      type="button"
                                      onClick={() => {
                                        setCustomTerm(term.toString());
                                        setTermError('');
                                      }}
                                      className="px-2 py-1 text-xs !bg-purple-100 !text-purple-700 rounded hover:!bg-purple-200 !cursor-pointer transition-colors"
                                    >
                                      {term}Y
                                    </button>
                                  ))}
                                </div>
                              );
                            }
                            return null;
                          })()}

                          <div className="text-xs text-gray-600 italic mt-2">
                            Specify how many years of coverage you need. Must be within the range supported by this product's plans.
                          </div>
                        </div>

                        {/* Payment Frequency Selector for Custom Plan */}
                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-gray-700">
                            Payment Frequency
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { value: 'Monthly', label: 'Monthly', badge: '+5%' },
                              { value: 'Quarterly', label: 'Quarterly', badge: '+3%' },
                              { value: 'Semi-Annual', label: 'Semi-Annual', badge: '+2%' },
                              { value: 'Annual', label: 'Annual', badge: 'Base' },
                              { value: 'LumpSum', label: 'Lump Sum', badge: '-8%' }
                            ].map((freq) => (
                              <Button
                                key={freq.value}
                                type="button"
                                variant={customPaymentFrequency === freq.value ? 'default' : 'outline'}
                                onClick={() => setCustomPaymentFrequency(freq.value)}
                                className={`!cursor-pointer justify-between text-xs ${customPaymentFrequency === freq.value
                                  ? '!bg-purple-600 hover:!bg-purple-700 !text-white !border-purple-600'
                                  : '!border-purple-200 !text-gray-700 hover:!bg-purple-50'
                                  }`}
                              >
                                <span>{freq.label}</span>
                                <span className={`text-xs font-medium ${customPaymentFrequency === freq.value
                                  ? 'text-white'
                                  : freq.value === 'LumpSum' ? 'text-green-600' :
                                    freq.value === 'Monthly' ? 'text-red-600' :
                                      freq.value === 'Annual' ? 'text-gray-500' : 'text-orange-600'
                                  }`}>
                                  {freq.badge}
                                </span>
                              </Button>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 italic">
                            Select your preferred payment schedule. Custom premium will be calculated based on your selection.
                          </p>
                        </div>

                        {/* Calculate Button */}
                        <Button
                          onClick={calculateCustomPremium}
                          disabled={calculatingCustom || termError !== '' || customTerm.trim() === ''}
                          className="w-full !bg-purple-600 hover:!bg-purple-700 !cursor-pointer disabled:!opacity-50 disabled:!cursor-not-allowed"
                        >
                          {calculatingCustom ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                              Calculating...
                            </>
                          ) : (
                            <>
                              <Calculator className="size-4 mr-2" />
                              Calculate Custom Premium
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Right Column - Result */}
                      <div className="space-y-4">
                        {customPremium ? (
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="bg-green-600 rounded-full p-2">
                                <CheckCircle className="size-5 text-white" />
                              </div>
                              <h3 className="font-bold text-green-900">Your Custom Plan</h3>
                            </div>

                            <div className="space-y-3">
                              <div className="flex justify-between items-center pb-3 border-b border-green-200">
                                <span className="text-sm text-green-700">Coverage Amount</span>
                                <span className="font-bold text-green-900">${(customCoverage / 1000).toFixed(0)}K</span>
                              </div>
                              <div className="flex justify-between items-center pb-3 border-b border-green-200">
                                <span className="text-sm text-green-700">Term Length</span>
                                <span className="font-bold text-green-900">{parseInt(customTerm)} Years</span>
                              </div>
                              <div className="flex justify-between items-center pb-3 border-b border-green-200">
                                <span className="text-sm text-green-700">Payment Frequency</span>
                                <span className="font-bold text-green-900">{customPaymentFrequency}</span>
                              </div>

                              <div className="bg-white rounded-lg p-4 mt-4">
                                <div className="text-center">
                                  <p className="text-xs text-gray-500 mb-1">Estimated Premium</p>
                                  <p className="text-3xl font-bold text-green-600">
                                    ${Number(customPremium).toFixed(2)}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    per {customPaymentFrequency === 'LumpSum' ? 'single payment' : customPaymentFrequency.toLowerCase()}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Important Note */}
                            <Alert className="bg-blue-50 border-blue-200">
                              <Info className="size-4 text-blue-600" />
                              <AlertDescription className="text-xs text-blue-800">
                                <strong>Note:</strong> This is an estimated premium based on standard assumptions (Age 30, Male, Good Health, Low Risk Occupation).
                                Your actual premium will be calculated after you provide complete personal and health information in the application form.
                              </AlertDescription>
                            </Alert>

                            <Button
                              onClick={handleApplyCustomPlan}
                              className="w-full !bg-green-600 hover:!bg-green-700 !cursor-pointer"
                            >
                              Apply with Custom Plan <ArrowRight className="size-4 ml-2" />
                            </Button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-purple-200 rounded-xl p-8 text-center space-y-3">
                            <div className="bg-purple-100 rounded-full size-16 flex items-center justify-center mx-auto">
                              <Calculator className="size-8 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Configure Your Plan</h3>
                            <p className="text-sm text-gray-500">
                              Adjust the coverage amount and term length, then click calculate to see your personalized premium
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Plan Comparison Table */}
              {plans.length > 1 && (
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Detailed Plan Comparison</CardTitle>
                    <CardDescription>Compare all features side by side</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Feature</th>
                            {plans.map(plan => (
                              <th key={plan.id} className="text-center py-3 px-4 min-w-[150px]">
                                {plan.planName.split(' - ')[1]}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b bg-gray-50">
                            <td className="py-3 px-4 font-medium">Monthly Premium</td>
                            {plans.map(plan => (
                              <td key={plan.id} className="text-center py-3 px-4 font-semibold">
                                ${plan.basePremiumMonthly}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4 font-medium">Coverage Amount</td>
                            {plans.map(plan => (
                              <td key={plan.id} className="text-center py-3 px-4">
                                ${plan.coverageAmount.toLocaleString()}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b bg-gray-50">
                            <td className="py-3 px-4 font-medium">Term Length</td>
                            {plans.map(plan => (
                              <td key={plan.id} className="text-center py-3 px-4">
                                {plan.termYears} years
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4 font-medium">Accidental Death</td>
                            {plans.map(plan => (
                              <td key={plan.id} className="text-center py-3 px-4">
                                ${plan.accidentalDeathBenefit.toLocaleString()}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b bg-gray-50">
                            <td className="py-3 px-4 font-medium">Disability Benefit</td>
                            {plans.map(plan => (
                              <td key={plan.id} className="text-center py-3 px-4">
                                ${plan.disabilityBenefit.toLocaleString()}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4 font-medium">Critical Illness</td>
                            {plans.map(plan => (
                              <td key={plan.id} className="text-center py-3 px-4">
                                ${plan.criticalIllnessBenefit.toLocaleString()}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b bg-gray-50">
                            <td className="py-3 px-4 font-medium">Maternity Benefits</td>
                            {plans.map(plan => (
                              <td key={plan.id} className="text-center py-3 px-4">
                                {plan.includesMaternityBenefit ? (
                                  <CheckCircle2 className="size-5 text-green-600 mx-auto" />
                                ) : (
                                  <X className="size-5 text-gray-400 mx-auto" />
                                )}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4 font-medium">Rider Options</td>
                            {plans.map(plan => (
                              <td key={plan.id} className="text-center py-3 px-4">
                                {plan.includesRiderOptions ? (
                                  <CheckCircle2 className="size-5 text-green-600 mx-auto" />
                                ) : (
                                  <X className="size-5 text-gray-400 mx-auto" />
                                )}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b bg-gray-50">
                            <td className="py-3 px-4 font-medium">Medical Exam Required</td>
                            {plans.map(plan => (
                              <td key={plan.id} className="text-center py-3 px-4">
                                {plan.requiresMedicalExam ? 'Yes' : 'No'}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Coverage Scope Tab */}
            <TabsContent value="coverage" className="space-y-6 animate-in fade-in-50 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Comprehensive Coverage Details</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Understanding what's covered helps you make informed decisions about your protection
                </p>
              </div>

              {coverageScope.map((section, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="size-6 text-blue-600" />
                      {section.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {section.items.map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className={`flex items-start gap-3 p-4 rounded-lg border ${item.covered
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                            }`}
                        >
                          {item.covered ? (
                            <CheckCircle2 className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <X className="size-5 text-red-600 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <h4 className="font-semibold text-gray-900">{item.name}</h4>
                              <Badge variant={item.covered ? 'default' : 'destructive'} className="flex-shrink-0">
                                {item.covered ? 'Covered' : 'Not Covered'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{item.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Info className="size-6 text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Important Note</h4>
                      <p className="text-sm text-blue-800">
                        Coverage details may vary by plan and state. All claims are subject to policy terms and conditions.
                        Please review your policy documents carefully or contact our support team for clarification.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Exclusions Tab */}
            <TabsContent value="exclusions" className="space-y-6 animate-in fade-in-50 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Policy Exclusions</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Understanding what's not covered is just as important as knowing what is
                </p>
              </div>

              {exclusions.map((section, idx) => (
                <Card key={idx} className="border-red-200">
                  <CardHeader className="bg-red-50">
                    <CardTitle className="flex items-center gap-2 text-red-900">
                      <X className="size-6 text-red-600" />
                      {section.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {section.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                          <X className="size-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <AlertCircle className="size-6 text-orange-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-orange-900 mb-2">Disclosure Requirement</h4>
                      <p className="text-sm text-orange-800 mb-3">
                        You must disclose all material information during application. Non-disclosure or
                        misrepresentation can lead to claim rejection or policy cancellation.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-orange-800">
                        <li>All pre-existing medical conditions</li>
                        <li>Family medical history</li>
                        <li>Hazardous occupations or hobbies</li>
                        <li>Previous insurance claims or rejections</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Claims Process Tab */}
            <TabsContent value="claims" className="space-y-6 animate-in fade-in-50 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">How to File a Claim</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  We've streamlined our claims process to ensure quick and hassle-free settlements
                </p>
              </div>

              <div className="relative">
                {claimsProcess.map((step, idx) => (
                  <div key={idx} className="relative pb-8 last:pb-0">
                    {idx !== claimsProcess.length - 1 && (
                      <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-blue-200" />
                    )}

                    <Card className="relative hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <div className="flex-shrink-0">
                            <div className="size-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                              {step.step}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{step.title}</h3>
                                <p className="text-gray-600">{step.description}</p>
                              </div>
                              <Badge variant="outline" className="flex-shrink-0">
                                <Clock className="size-3 mr-1" />
                                {step.timeline}
                              </Badge>
                            </div>
                            <div className="flex items-start gap-3 mt-4 p-4 bg-gray-50 rounded-lg">
                              <step.icon className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-gray-700">{step.details}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <CheckCircle2 className="size-6 text-green-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-green-900 mb-2">Fast Track Claims</h4>
                      <p className="text-sm text-green-800 mb-3">
                        Claims up to $50,000 with complete documentation are processed within 7 days!
                      </p>
                      <div className="grid md:grid-cols-3 gap-4 mt-4">
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-2xl font-bold text-green-600">98.5%</p>
                          <p className="text-xs text-gray-600">Claim Settlement Ratio</p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-2xl font-bold text-green-600">7 Days</p>
                          <p className="text-xs text-gray-600">Average Processing Time</p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-2xl font-bold text-green-600">24/7</p>
                          <p className="text-xs text-gray-600">Claims Support</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Premium Breakdown Tab */}
            <TabsContent value="premium" className="space-y-6 animate-in fade-in-50 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Understanding Your Premium</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Transparent breakdown of fees, charges, and payment options
                </p>
              </div>

              {selectedPlan && (
                <>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                      <CardContent className="p-6 text-center">
                        <CircleDollarSign className="size-12 text-blue-600 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-1">Monthly Premium</p>
                        <p className="text-3xl font-bold text-blue-900">
                          ${selectedPlan.basePremiumMonthly}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          +{(product.monthlySurcharge * 100).toFixed(0)}% payment frequency surcharge
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                      <CardContent className="p-6 text-center">
                        <Banknote className="size-12 text-green-600 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-1">Annual Premium</p>
                        <p className="text-3xl font-bold text-green-900">
                          ${selectedPlan.basePremiumAnnual}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Base rate before personalization
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                      <CardContent className="p-6 text-center">
                        <TrendingUp className="size-12 text-purple-600 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-1">Coverage Amount</p>
                        <p className="text-3xl font-bold text-purple-900">
                          ${selectedPlan.coverageAmount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Death benefit guarantee
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Receipt className="size-6 text-blue-600" />
                        One-Time Fees & Charges
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-3 border-b">
                            <span className="text-gray-600">Processing Fee</span>
                            <span className="font-semibold text-gray-900">${product.processingFee}</span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b">
                            <span className="text-gray-600">Policy Issuance Fee</span>
                            <span className="font-semibold text-gray-900">${product.policyIssuanceFee}</span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b">
                            <span className="text-gray-600">Medical Checkup Fee</span>
                            <span className="font-semibold text-gray-900">${product.medicalCheckupFee}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-3 border-b">
                            <span className="text-gray-600">Admin Fee (Annual)</span>
                            <span className="font-semibold text-gray-900">${product.adminFee}</span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b bg-green-50">
                            <span className="text-gray-600">Total First Year Cost</span>
                            <span className="font-semibold text-green-600">
                              ${(selectedPlan.basePremiumAnnual + product.processingFee + product.policyIssuanceFee + product.medicalCheckupFee + product.adminFee).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Percent className="size-6 text-blue-600" />
                        Payment Frequency Options
                      </CardTitle>
                      <CardDescription>Choose how you want to pay your premiums</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="border rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition">
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 className="size-5 text-blue-600" />
                            <h4 className="font-semibold">Annual</h4>
                          </div>
                          <p className="text-2xl font-bold text-blue-600 mb-1">
                            ${selectedPlan.basePremiumAnnual.toFixed(0)}
                          </p>
                          <p className="text-xs text-gray-600">Once a year</p>
                        </div>

                        <div className="border rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition">
                          <div className="flex items-center gap-2 mb-3">
                            <Wallet className="size-5 text-blue-600" />
                            <h4 className="font-semibold">Semi-Annual</h4>
                          </div>
                          <p className="text-2xl font-bold text-blue-600 mb-1">
                            ${(selectedPlan.basePremiumSemiAnnual || (selectedPlan.basePremiumMonthly * 6)).toFixed(0)}
                          </p>
                          <p className="text-xs text-gray-600">Every 6 months</p>
                        </div>

                        <div className="border rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition">
                          <div className="flex items-center gap-2 mb-3">
                            <Calendar className="size-5 text-blue-600" />
                            <h4 className="font-semibold">Quarterly</h4>
                          </div>
                          <p className="text-2xl font-bold text-blue-600 mb-1">
                            ${(selectedPlan.basePremiumQuarterly || (selectedPlan.basePremiumMonthly * 3)).toFixed(0)}
                          </p>
                          <p className="text-xs text-gray-600">Every 3 months</p>
                        </div>

                        <div className="border rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition">
                          <div className="flex items-center gap-2 mb-3">
                            <CreditCard className="size-5 text-blue-600" />
                            <h4 className="font-semibold">Monthly</h4>
                          </div>
                          <p className="text-2xl font-bold text-blue-600 mb-1">
                            ${selectedPlan.basePremiumMonthly.toFixed(0)}
                          </p>
                          <p className="text-xs text-gray-600">Every month</p>
                          <Badge variant="secondary" className="mt-3 w-full justify-center">
                            Most Flexible
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Eligibility Tab */}
            <TabsContent value="eligibility" className="space-y-6 animate-in fade-in-50 duration-500">
              <Card>
                <CardHeader>
                  <CardTitle>Eligibility Requirements</CardTitle>
                  <CardDescription>Who can apply for this policy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Age Requirements by Plan</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {plans.map(plan => (
                        <div key={plan.id} className="border rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {plan.planName.split(' - ')[1]}
                          </h4>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="size-4 text-blue-600" />
                            <span className="text-gray-600">
                              Age {plan.minAge} - {plan.maxAge} years
                            </span>
                          </div>
                          {plan.requiresMedicalExam && (
                            <div className="flex items-center gap-2 text-sm mt-2">
                              <FileText className="size-4 text-orange-600" />
                              <span className="text-gray-600">Medical exam required</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">General Requirements</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Residency</p>
                          <p className="text-sm text-gray-600">Must be a legal resident of the country</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Health Status</p>
                          <p className="text-sm text-gray-600">Good to fair health (underwriting required)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Income Verification</p>
                          <p className="text-sm text-gray-600">Proof of income for coverage above $250,000</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="size-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Identity Documents</p>
                          <p className="text-sm text-gray-600">Valid government-issued ID and social security number</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex gap-4">
                      <Info className="size-6 text-blue-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">Application Process</h4>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                          <li>Complete online application (10-15 minutes)</li>
                          <li>Schedule medical examination (if required)</li>
                          <li>Underwriting review (2-4 weeks)</li>
                          <li>Policy approval and issuance</li>
                          <li>Coverage begins upon first premium payment</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-6 animate-in fade-in-50 duration-500">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>Get answers to common questions about {product.productName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        q: 'How long does it take to get approved?',
                        a: 'Most applications are processed within 2-4 weeks. If medical exams are required, it may take slightly longer. We\'ll keep you updated throughout the process.'
                      },
                      {
                        q: 'Can I increase my coverage later?',
                        a: 'Yes, you can apply to increase your coverage. However, this will require a new underwriting review and may result in higher premiums based on your current age and health.'
                      },
                      {
                        q: 'What happens if I miss a premium payment?',
                        a: 'You have a 30-day grace period to make your payment. If you miss this deadline, your policy may lapse. However, you can usually reinstate it within a certain timeframe.'
                      },
                      {
                        q: 'Are the premiums guaranteed not to increase?',
                        a: 'Yes, your premiums are locked in at the rate you\'re quoted and will not increase for the life of your policy, as long as you maintain your coverage.'
                      },
                      {
                        q: 'Can I borrow against my policy?',
                        a: 'Yes, once your policy has accumulated cash value, you can take out a policy loan. The loan amount is based on your available cash value and doesn\'t require credit checks.'
                      },
                      {
                        q: 'What if I change my mind after purchasing?',
                        a: 'You have a 30-day "free look" period. If you\'re not satisfied, you can cancel your policy and receive a full refund of premiums paid.'
                      }
                    ].map((faq, index) => (
                      <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                        <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                        <p className="text-gray-600">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Who Should Buy This */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <UserCheck className="size-7 text-blue-600" />
                Who Should Buy This Policy?
              </CardTitle>
              <CardDescription>
                This life insurance is ideal for these individuals and families
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {whoShouldBuy.map((persona, idx) => (
                  <div key={idx} className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition">
                    <div className="flex-shrink-0">
                      <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <persona.icon className="size-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{persona.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{persona.description}</p>
                      <p className="text-xs text-blue-600 font-medium">→ {persona.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Building2 className="size-7 text-blue-600" />
                  Related Life Insurance Products
                </CardTitle>
                <CardDescription>
                  Compare similar products to find the best fit for your needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedProducts.map((relProduct, idx) => (
                    <Link
                      key={relProduct.id}
                      to={`/motor-insurance/${relProduct.id}`}
                      className="group animate-in fade-in-50 slide-in-from-bottom-4"
                      style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'backwards' }}
                    >
                      <Card className="h-full hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:scale-105">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <Shield className="size-8 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                            <Badge variant="secondary">{relProduct.productCode}</Badge>
                          </div>
                          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors duration-300">
                            {relProduct.productName}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {relProduct.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Starting from</span>
                              <span className="font-bold text-blue-600 group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center gap-1">
                                View Plans <ArrowRight className="size-3" />
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Facts Summary */}
          <div className="grid md:grid-cols-4 gap-4 mt-8">
            <Card className="bg-blue-50 border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <Star className="size-10 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-2xl font-bold text-blue-900">4.8/5</p>
                <p className="text-xs text-gray-600">Customer Rating</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <Users className="size-10 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-2xl font-bold text-green-900">50K+</p>
                <p className="text-xs text-gray-600">Policyholders</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <CheckCircle2 className="size-10 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-2xl font-bold text-purple-900">98.5%</p>
                <p className="text-xs text-gray-600">Claim Settlement</p>
              </CardContent>
            </Card>
            <Card className="bg-orange-50 border-orange-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <Timer className="size-10 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-2xl font-bold text-orange-900">7 Days</p>
                <p className="text-xs text-gray-600">Average Processing</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <Card className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white border-0">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">Ready to Get Started?</h3>
                  <p className="text-blue-100">
                    Get a personalized quote in minutes. No commitment required.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={handleGetQuote}
                    className="cursor-pointer"
                  >
                    Get Your Quote
                    <ArrowRight className="ml-2 size-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 cursor-pointer">
                    <Phone className="mr-2 size-5" />
                    Call Expert
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Phone className="size-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-1">Call Us</h4>
                <p className="text-sm text-gray-600 mb-2">Mon-Fri 8AM-8PM</p>
                <p className="font-semibold text-blue-600">1-800-INSURANCE</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <MessageCircle className="size-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-1">Live Chat</h4>
                <p className="text-sm text-gray-600 mb-2">Available 24/7</p>
                <Button variant="link" className="text-blue-600 p-0 cursor-pointer">Start Chat</Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Mail className="size-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold mb-1">Email</h4>
                <p className="text-sm text-gray-600 mb-2">Response within 24h</p>
                <p className="font-semibold text-blue-600">support@insurance.com</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
