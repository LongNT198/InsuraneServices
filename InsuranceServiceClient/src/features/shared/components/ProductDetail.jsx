import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Shield,
  Heart,
  Activity,
  TrendingUp,
  Users,
  FileText,
  Calculator,
  Phone,
  Mail,
  Clock,
  AlertCircle,
  Info,
  Award,
  DollarSign,
  Calendar,
  Percent,
  Target,
  Briefcase,
  BookOpen,
  MessageCircle,
  Star,
  Gift,
  Download,
  Zap,
  ArrowRight
} from 'lucide-react';
import axios from '../api/axios';
import { MiniCalculator } from './insurance/MiniCalculator';
import plansService from '../api/services/plansService';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [plans, setPlans] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState('Annual');
  const [calculatingPrices, setCalculatingPrices] = useState(false);
  const [planPrices, setPlanPrices] = useState({});

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch product details
        const response = await axios.get(`/api/products/${id}`);
        const productData = response.product || response;
        setProduct(productData);

        // Fetch plans for this product
        try {
          const productPlans = await plansService.getPlansByProduct(id);
          setPlans(productPlans || []);
        } catch (planError) {
          console.error('Error loading plans:', planError);
          setPlans([]);
        }

        // Fetch related products (same type)
        const allProductsResponse = await axios.get('/api/products');
        const allProducts = allProductsResponse.data || [];
        const related = allProducts
          .filter(p => p.productType === productData.productType && p.id !== productData.id)
          .slice(0, 3);
        setRelatedProducts(related);

      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProductData();
    }
  }, [id]);

  // Get color theme based on product type
  const getColorTheme = (type) => {
    switch (type) {
      case 'Life':
        return {
          gradient: 'from-red-600 to-pink-700',
          bg: 'bg-red-50',
          text: 'text-red-600',
          border: 'border-red-200',
          icon: 'bg-red-100 text-red-600'
        };
      case 'Medical':
      case 'Health':
        return {
          gradient: 'from-green-600 to-emerald-700',
          bg: 'bg-green-50',
          text: 'text-green-600',
          border: 'border-green-200',
          icon: 'bg-green-100 text-green-600'
        };
      case 'Motor':
        return {
          gradient: 'from-blue-600 to-indigo-700',
          bg: 'bg-blue-50',
          text: 'text-blue-600',
          border: 'border-blue-200',
          icon: 'bg-blue-100 text-blue-600'
        };
      case 'Home':
        return {
          gradient: 'from-orange-600 to-red-600',
          bg: 'bg-orange-50',
          text: 'text-orange-600',
          border: 'border-orange-200',
          icon: 'bg-orange-100 text-orange-600'
        };
      default:
        return {
          gradient: 'from-blue-600 to-blue-700',
          bg: 'bg-blue-50',
          text: 'text-blue-600',
          border: 'border-blue-200',
          icon: 'bg-blue-100 text-blue-600'
        };
    }
  };

  // Payment frequency options
  const paymentFrequencies = [
    { value: 'Monthly', label: 'Monthly', description: 'Pay every month', icon: Calendar },
    { value: 'Quarterly', label: 'Quarterly', description: 'Pay every 3 months', icon: Calendar },
    { value: 'Semi-Annual', label: 'Semi-Annual', description: 'Pay every 6 months', icon: Calendar },
    { value: 'Annual', label: 'Annual', description: 'Pay once a year', icon: Star },
    { value: 'LumpSum', label: 'Lump Sum', description: 'One-time payment', icon: Gift, discount: true }
  ];

  console.log('🔍 ProductDetail - Selected frequency:', selectedFrequency);

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

  // Load prices for all plans when frequency changes
  useEffect(() => {
    const loadPlanPrices = async () => {
      if (plans.length === 0) return;

      setCalculatingPrices(true);
      const prices = {};

      for (const plan of plans) {
        const price = await calculatePlanPremium(plan.id, selectedFrequency);
        if (price) {
          prices[plan.id] = price;
        }
      }

      setPlanPrices(prices);
      setCalculatingPrices(false);
    };

    loadPlanPrices();
  }, [plans, selectedFrequency]);

  // Get application route based on product type
  const getApplicationRoute = (productType, params = {}) => {
    const baseRoutes = {
      'Life': '/apply-life',
      'Health': '/apply-health',
      'Medical': '/apply-health',
      'Motor': '/apply-motor',
      'Home': '/apply-home',
    };

    const route = baseRoutes[productType] || '/apply-life';
    const queryParams = new URLSearchParams(params).toString();
    return queryParams ? `${route}?${queryParams}` : route;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="size-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="size-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const colors = getColorTheme(product?.productType || 'Life');

  // Get product-specific features based on actual product code
  const getProductFeatures = () => {
    const productCode = product?.productCode;
    if (!productCode) return [];

    // LIFE INSURANCE
    if (productCode === 'LIFE-001') { // Term Life
      return [
        { icon: Shield, title: 'Pure Protection', description: 'Affordable coverage for 10-25 years with no investment component' },
        { icon: DollarSign, title: 'Low Premiums', description: 'Most cost-effective life insurance option for families' },
        { icon: Users, title: 'Income Replacement', description: 'Ensures family financial security if breadwinner passes away' },
        { icon: Award, title: 'High Coverage', description: 'Get coverage up to $1M at affordable rates' }
      ];
    }
    if (productCode === 'LIFE-002') { // Whole Life
      return [
        { icon: Shield, title: 'Lifetime Coverage', description: 'Protection that lasts your entire life, guaranteed' },
        { icon: TrendingUp, title: 'Cash Value Growth', description: 'Build savings with guaranteed cash value accumulation' },
        { icon: Gift, title: 'Maturity Benefits', description: 'Receive maturity benefits plus accumulated bonuses' },
        { icon: Briefcase, title: 'Loan Facility', description: 'Take loans against policy cash value when needed' }
      ];
    }
    if (productCode === 'LIFE-003') { // Endowment
      return [
        { icon: Target, title: 'Dual Benefits', description: 'Life protection + guaranteed maturity benefits' },
        { icon: Calendar, title: 'Goal Planning', description: 'Perfect for education, retirement, or milestone goals' },
        { icon: TrendingUp, title: 'Guaranteed Returns', description: 'Receive lump sum on maturity even if alive' },
        { icon: Shield, title: 'Death Benefit', description: 'Full sum assured paid to family if insured passes away' }
      ];
    }

    // HEALTH INSURANCE
    if (productCode === 'HEALTH-001') { // Individual Health
      return [
        { icon: Heart, title: 'Individual Coverage', description: 'Personalized medical coverage up to $500k' },
        { icon: Activity, title: 'Hospitalization', description: 'Full coverage for room rent, surgery, ICU charges' },
        { icon: FileText, title: 'Outpatient Care', description: 'Includes pre and post hospitalization expenses' },
        { icon: Award, title: 'Cashless Claims', description: 'Network of 5000+ hospitals for cashless treatment' }
      ];
    }
    if (productCode === 'HEALTH-002') { // Family Floater
      return [
        { icon: Users, title: 'Family Coverage', description: 'Single policy covers entire family (up to 6 members)' },
        { icon: DollarSign, title: 'Cost Effective', description: 'Cheaper than individual policies for each member' },
        { icon: Heart, title: 'Maternity Benefits', description: 'Includes coverage for childbirth and newborn care' },
        { icon: Shield, title: 'Shared Sum Insured', description: 'Flexible usage up to $1M across all family members' }
      ];
    }
    if (productCode === 'HEALTH-003') { // Critical Illness
      return [
        { icon: AlertCircle, title: 'Critical Diseases', description: 'Covers 36+ critical illnesses including cancer, stroke' },
        { icon: DollarSign, title: 'Lump Sum Payout', description: 'Receive full amount on diagnosis, not reimbursement' },
        { icon: Activity, title: 'Early Stage Cover', description: 'Partial payout for early detection of diseases' },
        { icon: Shield, title: 'Multiple Claims', description: 'Get payouts for different illnesses during policy term' }
      ];
    }

    // MOTOR INSURANCE
    if (productCode === 'MOTOR-001') { // Car Insurance
      return [
        { icon: Shield, title: 'Comprehensive Cover', description: 'Own damage + third party liability protection' },
        { icon: Award, title: 'Zero Depreciation', description: 'Get full claim without depreciation deduction' },
        { icon: Phone, title: 'Roadside Assistance', description: '24/7 emergency support anywhere in the country' },
        { icon: FileText, title: 'Quick Claims', description: 'Cashless claims at 4000+ network garages' }
      ];
    }
    if (productCode === 'MOTOR-002') { // Two-Wheeler
      return [
        { icon: Shield, title: 'Bike Protection', description: 'Coverage for motorcycles and scooters of all types' },
        { icon: DollarSign, title: 'Affordable', description: 'Starting from just $180/year for third party cover' },
        { icon: Activity, title: 'Personal Accident', description: 'Owner-driver personal accident cover included' },
        { icon: Award, title: 'Accessories Cover', description: 'Protection for helmets, accessories, and modifications' }
      ];
    }
    if (productCode === 'MOTOR-003') { // Commercial Vehicle
      return [
        { icon: Briefcase, title: 'Business Coverage', description: 'For taxis, trucks, delivery vehicles, and fleets' },
        { icon: Shield, title: 'Third Party Liability', description: 'Mandatory legal liability coverage up to $300k' },
        { icon: Users, title: 'Passenger Cover', description: 'Covers passengers traveling in commercial vehicle' },
        { icon: FileText, title: 'Business Interruption', description: 'Loss of income coverage during repairs' }
      ];
    }

    // HOME INSURANCE
    if (productCode === 'HOME-001') { // Building
      return [
        { icon: Shield, title: 'Structure Protection', description: 'Coverage for house structure against disasters' },
        { icon: AlertCircle, title: 'Natural Calamities', description: 'Fire, earthquake, flood, storm damage covered' },
        { icon: Award, title: 'Rebuilding Costs', description: 'Full replacement cost, not depreciated value' },
        { icon: FileText, title: 'Fixtures Included', description: 'Built-in fixtures, fittings, and permanent structures' }
      ];
    }
    if (productCode === 'HOME-002') { // Contents
      return [
        { icon: Shield, title: 'Household Items', description: 'Furniture, electronics, appliances, and belongings' },
        { icon: AlertCircle, title: 'Theft & Burglary', description: 'Coverage against theft, robbery, and vandalism' },
        { icon: Award, title: 'Valuables Cover', description: 'Special coverage for jewelry, art, and collectibles' },
        { icon: DollarSign, title: 'Temporary Housing', description: 'Alternative accommodation costs during repairs' }
      ];
    }
    if (productCode === 'HOME-003') { // Comprehensive Shield
      return [
        { icon: Shield, title: 'All-in-One Package', description: 'Building + contents + liability in single policy' },
        { icon: Users, title: 'Liability Coverage', description: 'Legal liability for injury/damage to third parties' },
        { icon: Phone, title: 'Emergency Services', description: 'Plumber, electrician, locksmith emergency support' },
        { icon: Award, title: 'Best Value', description: 'Cheaper than buying building and contents separately' }
      ];
    }

    // Default features if product code doesn't match
    return [
      { icon: Shield, title: 'Comprehensive Coverage', description: 'Full protection tailored to your needs' },
      { icon: TrendingUp, title: 'Flexible Plans', description: 'Multiple plan options from Basic to Elite' },
      { icon: Users, title: 'Family Protection', description: 'Protect what matters most to you' },
      { icon: FileText, title: 'Easy Claims', description: 'Quick and hassle-free claim settlement' }
    ];
  };

  // What's covered - based on product code
  const getCoveredItems = () => {
    const productCode = product?.productCode;
    if (!productCode) return [];

    // LIFE INSURANCE
    if (productCode.startsWith('LIFE-001')) return [
      'Death benefit payout to nominees',
      'Terminal illness coverage (100% payout)',
      'Accidental death benefit (double coverage)',
      'Waiver of premium on disability',
      'Flexible premium payment options',
      'Tax benefits under applicable laws'
    ];
    if (productCode.startsWith('LIFE-002')) return [
      'Lifetime coverage until age 99',
      'Guaranteed cash value accumulation',
      'Maturity benefits with bonuses',
      'Death benefit to nominees',
      'Loan facility against policy value',
      'Paid-up policy option after 3 years'
    ];
    if (productCode.startsWith('LIFE-003')) return [
      'Maturity benefit (lump sum on survival)',
      'Death benefit during policy term',
      'Guaranteed returns on maturity',
      'Accidental death benefit rider',
      'Critical illness rider optional',
      'Tax-free maturity proceeds'
    ];

    // HEALTH INSURANCE
    if (productCode.startsWith('HEALTH-001')) return [
      'Hospitalization expenses (room, ICU, surgery)',
      'Pre-hospitalization (60 days) coverage',
      'Post-hospitalization (90 days) care',
      'Day care procedures without 24hr stay',
      'Ambulance charges up to limits',
      'Annual health check-ups included'
    ];
    if (productCode.startsWith('HEALTH-002')) return [
      'Coverage for 4-6 family members',
      'Maternity and newborn expenses',
      'Pre-existing diseases after waiting period',
      'Vaccination and preventive care',
      'Shared sum insured flexibility',
      'Restoration of sum insured benefit'
    ];
    if (productCode.startsWith('HEALTH-003')) return [
      '36+ critical illnesses covered',
      'Lump sum payout on diagnosis',
      'Cancer, heart attack, stroke, kidney failure',
      'Parkinson\'s, Alzheimer\'s, paralysis',
      'Major organ transplant coverage',
      'Early stage cancer partial payout'
    ];

    // MOTOR INSURANCE
    if (productCode.startsWith('MOTOR-001')) return [
      'Own damage to vehicle (accidents, fire, theft)',
      'Third party property damage liability',
      'Third party bodily injury/death',
      'Natural calamities (flood, earthquake, storm)',
      'Riots, strikes, and terrorist acts',
      'Personal accident cover for owner-driver'
    ];
    if (productCode.startsWith('MOTOR-002')) return [
      'Two-wheeler damage coverage',
      'Theft and total loss protection',
      'Third party legal liability',
      'Personal accident for rider (Rs 15 lakh)',
      'Pillion passenger cover optional',
      'Accessories and modifications cover'
    ];
    if (productCode.startsWith('MOTOR-003')) return [
      'Commercial vehicle damage',
      'Legal third party liability',
      'Paid driver cover included',
      'Goods in transit coverage',
      'Passenger liability protection',
      'Loss of income during repairs'
    ];

    // HOME INSURANCE
    if (productCode.startsWith('HOME-001')) return [
      'Fire and lightning damage',
      'Earthquake and landslide',
      'Floods and water damage',
      'Storm, cyclone, hurricane',
      'Explosion and implosion',
      'Rebuilding cost (replacement value)'
    ];
    if (productCode.startsWith('HOME-002')) return [
      'Furniture and furnishings',
      'Electronics and appliances',
      'Clothing and personal items',
      'Theft and burglary losses',
      'Jewelry and valuables (limits apply)',
      'Fire, flood, and natural disaster damage'
    ];
    if (productCode.startsWith('HOME-003')) return [
      'Building structure coverage',
      'Contents and belongings',
      'Public liability coverage',
      'Alternative accommodation expenses',
      'Emergency home repairs',
      'Rent loss coverage for landlords'
    ];

    return [
      'Comprehensive protection',
      'Financial security for family',
      'Tax benefits available',
      'Flexible coverage options'
    ];
  };

  // What's not covered - based on product code
  const getExclusions = () => {
    const productCode = product?.productCode;
    if (!productCode) return [];

    // LIFE INSURANCE
    if (productCode.startsWith('LIFE-')) return [
      'Suicide within first 12 months',
      'Death due to war or terrorism',
      'Self-inflicted injuries',
      'Death during illegal activities',
      'Non-disclosure of medical history',
      'Death due to drug/alcohol abuse'
    ];

    // HEALTH INSURANCE
    if (productCode.startsWith('HEALTH-')) return [
      'Cosmetic and plastic surgery',
      'Dental treatment (unless accident)',
      'Pre-existing diseases (first 2-4 years)',
      'Infertility and IVF treatments',
      'Experimental/unproven treatments',
      'Injuries from adventure sports'
    ];

    // MOTOR INSURANCE
    if (productCode.startsWith('MOTOR-')) return [
      'Normal wear and tear',
      'Mechanical or electrical breakdown',
      'Driving under influence of alcohol/drugs',
      'Driving without valid license',
      'Using vehicle for racing/speed testing',
      'Consequential losses (depreciation)'
    ];

    // HOME INSURANCE
    if (productCode.startsWith('HOME-')) return [
      'Normal wear and tear',
      'Gradual deterioration',
      'War and nuclear risks',
      'Willful damage by insured',
      'Unoccupied property (over 30 days)',
      'Jewelry/cash above specified limits'
    ];

    return [
      'Fraudulent claims',
      'Intentional damage',
      'Non-disclosure of material facts',
      'Claims made after policy lapse'
    ];
  };

  // Additional benefits
  const getAdditionalBenefits = () => {
    if (!product?.productType) return [];
    switch (product.productType) {
      case 'Life':
        return [
          { icon: Gift, title: 'Loyalty Bonus', desc: 'Extra benefits for long-term policyholders' },
          { icon: Award, title: 'Tax Benefits', desc: 'Deductions under Section 80C & 10(10D)' },
          { icon: Users, title: 'Nomination Facility', desc: 'Easy nomination for your beneficiaries' },
          { icon: Target, title: 'Riders Available', desc: 'Add-on covers for enhanced protection' }
        ];
      case 'Medical':
        return [
          { icon: Award, title: 'No Claim Bonus', desc: 'Premium discount for claim-free years' },
          { icon: Gift, title: 'Preventive Care', desc: 'Annual health check-ups included' },
          { icon: Target, title: 'Restoration Benefit', desc: 'Sum insured reinstatement' },
          { icon: Users, title: 'Family Discount', desc: 'Save more on family floater plans' }
        ];
      case 'Motor':
        return [
          { icon: Gift, title: 'No Claim Bonus', desc: 'Up to 50% discount on renewal' },
          { icon: Award, title: 'Roadside Assistance', desc: '24/7 breakdown support' },
          { icon: Target, title: 'Zero Depreciation', desc: 'Full claim without depreciation' },
          { icon: Users, title: 'Invoice Cover', desc: 'Get vehicle invoice price on total loss' }
        ];
      case 'Home':
        return [
          { icon: Gift, title: 'Emergency Assistance', desc: '24/7 emergency helpline' },
          { icon: Award, title: 'Temporary Accommodation', desc: 'Hotel stay during repairs' },
          { icon: Target, title: 'Valuables Cover', desc: 'Protection for jewelry & art' },
          { icon: Users, title: 'Liability Protection', desc: 'Third-party liability coverage' }
        ];
      default:
        return [];
    }
  };

  // Claims process steps
  const getClaimsProcess = () => {
    if (!product?.productType) return [];
    switch (product.productType) {
      case 'Life':
        return [
          { step: '1', title: 'Notify Insurer', desc: 'Inform within 7 days of event' },
          { step: '2', title: 'Submit Documents', desc: 'Death certificate, policy papers, claim form' },
          { step: '3', title: 'Verification', desc: 'Insurer verifies claim details' },
          { step: '4', title: 'Settlement', desc: 'Claim paid within 30 days' }
        ];
      case 'Medical':
        return [
          { step: '1', title: 'Hospitalization', desc: 'Inform insurer before admission (if planned)' },
          { step: '2', title: 'Cashless/Reimbursement', desc: 'Get treatment at network hospital or pay upfront' },
          { step: '3', title: 'Submit Bills', desc: 'Provide medical bills and reports' },
          { step: '4', title: 'Claim Settlement', desc: 'Approved claims paid within 15 days' }
        ];
      case 'Motor':
        return [
          { step: '1', title: 'Report Incident', desc: 'Inform police & insurer immediately' },
          { step: '2', title: 'Survey Arranged', desc: 'Insurer inspects vehicle damage' },
          { step: '3', title: 'Repair & Bills', desc: 'Get repairs done, submit bills' },
          { step: '4', title: 'Claim Payment', desc: 'Reimbursement or direct payment to garage' }
        ];
      case 'Home':
        return [
          { step: '1', title: 'Report Loss', desc: 'Inform insurer & file police complaint' },
          { step: '2', title: 'Document Damage', desc: 'Take photos, prepare loss list' },
          { step: '3', title: 'Assessment', desc: 'Surveyor inspects property' },
          { step: '4', title: 'Settlement', desc: 'Claim processed after approval' }
        ];
      default:
        return [];
    }
  };

  // Eligibility criteria
  const getEligibilityCriteria = () => {
    if (!product?.productType) return { minAge: 18, maxAge: 65, requirements: [] };
    switch (product.productType) {
      case 'Life':
        return {
          minAge: 18,
          maxAge: 65,
          requirements: [
            'Indian citizen or NRI',
            'Medical examination may be required',
            'Good health declaration',
            'Valid identification documents'
          ]
        };
      case 'Medical':
        return {
          minAge: 18,
          maxAge: 65,
          requirements: [
            'Pre-existing conditions must be declared',
            'Medical tests for high sum insured',
            'Dependent children: 91 days to 25 years',
            'Family floater option available'
          ]
        };
      case 'Motor':
        return {
          minAge: 18,
          maxAge: null,
          requirements: [
            'Valid driving license',
            'Vehicle registration certificate',
            'Previous insurance policy (for renewal)',
            'Pollution certificate (PUC)'
          ]
        };
      case 'Home':
        return {
          minAge: 18,
          maxAge: null,
          requirements: [
            'Property ownership proof',
            'Property valuation documents',
            'Building structure details',
            'Security measures in place'
          ]
        };
      default:
        return { minAge: 18, maxAge: 65, requirements: [] };
    }
  };

  const eligibility = getEligibilityCriteria();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb & Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            {product?.productType && (
              <>
                <Link to={`/${product.productType.toLowerCase()}-insurance`} className="hover:text-blue-600">
                  {product.productType} Insurance
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-900">{product?.productName || 'Loading...'}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className={`bg-gradient-to-br ${colors.gradient} text-white py-12`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6 text-white hover:bg-white/10"
            >
              <ArrowLeft className="size-4 mr-2" />
              Back
            </Button>

            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary" className="text-sm">
                    {product.productType} Insurance
                  </Badge>
                  {product.isActive && (
                    <Badge variant="default" className="bg-white/20 text-white">
                      Active
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl font-bold mb-4">{product.productName}</h1>
                <p className="text-lg text-white/90 mb-6">{product.description}</p>

                <div className="flex gap-4">
                  <Button size="lg" variant="secondary" asChild>
                    <Link to={getApplicationRoute(product.productType, {
                      productId: product.id
                    })}>
                      Apply Now
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900"
                  >
                    <Phone className="size-4 mr-2" />
                    Contact Us
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <Card className="min-w-[300px]">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-3">Quick Info</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Product Code</span>
                        <span className="text-sm font-mono font-semibold">{product.productCode}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Available Plans</span>
                        <Badge variant="secondary">{plans.length} Plans</Badge>
                      </div>
                      {plans.length > 0 && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Starting From</span>
                            <span className="text-lg font-bold text-green-600">
                              ${Math.min(...plans.map(p => Math.round(p.basePremiumMonthly || p.basePremiumAnnual / 12)))}/mo
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Max Coverage</span>
                            <span className="text-sm font-semibold">
                              ${Math.max(...plans.map(p => p.coverageAmount)).toLocaleString()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500 mb-3">Need help choosing?</p>
                    <Button size="sm" variant="outline" className="w-full">
                      <Phone className="size-3 mr-2" />
                      Call 1800-123-4567
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Features */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {getProductFeatures().map((feature, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex gap-4">
                        <div className={`${colors.icon} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <feature.icon className="size-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Product Fees */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Fees & Charges</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Processing Fee</span>
                      <span className="font-semibold text-gray-900">${product.processingFee?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Policy Issuance Fee</span>
                      <span className="font-semibold text-gray-900">${product.policyIssuanceFee?.toLocaleString() || 0}</span>
                    </div>
                    {product.medicalCheckupFee > 0 && (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600">Medical Checkup Fee</span>
                        <span className="font-semibold text-gray-900">${product.medicalCheckupFee?.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">Admin Fee (Annual)</span>
                      <span className="font-semibold text-gray-900">${product.adminFee?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    * All fees are one-time charges unless specified. Fees may vary based on plan selected.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Available Plans Section - Redesigned */}
            {plans.length > 0 && (
              <section className="py-8">
                <div className="text-center mb-8">
                  <Badge className="mb-3">{plans.length} Plans Available</Badge>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Choose Your Coverage Plan</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Select your preferred payment frequency and compare plans. Prices shown are calculated for age 30, good health.
                  </p>
                </div>

                {/* Payment Frequency Selector - Redesigned */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`${getColorTheme(product.productType).icon} w-10 h-10 rounded-lg flex items-center justify-center`}>
                      <Calendar className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Payment Frequency</h3>
                      <p className="text-sm text-gray-600">Choose how often you want to pay</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {paymentFrequencies.map((freq) => {
                      const colorTheme = getColorTheme(product.productType);
                      const FreqIcon = freq.icon;
                      return (
                        <button
                          key={freq.value}
                          onClick={() => setSelectedFrequency(freq.value)}
                          disabled={calculatingPrices}
                          className={`p-4 rounded-lg border-2 transition-all ${selectedFrequency === freq.value
                              ? `${colorTheme.border} ${colorTheme.bg} ${colorTheme.text} font-semibold shadow-md scale-105`
                              : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:shadow-sm hover:scale-102'
                            } ${calculatingPrices ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <FreqIcon className="size-4" />
                            <div className="text-sm font-semibold">{freq.label}</div>
                          </div>
                          <div className="text-xs opacity-75">{freq.description}</div>
                          {freq.discount && selectedFrequency === freq.value && (
                            <Badge className="mt-2 text-xs bg-green-500">Best Value</Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Plans Grid - Redesigned like Schemes.jsx */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plans.map((plan) => {
                    const colorTheme = getColorTheme(product.productType);
                    const calculatedPrice = planPrices[plan.id];
                    const isCalculating = calculatingPrices || !calculatedPrice;

                    // Prepare benefits list
                    const benefits = [];
                    benefits.push(`${(plan.coverageAmount / 1000).toFixed(0)}k coverage for ${plan.termYears} years`);
                    if (plan.accidentalDeathBenefit > 0) {
                      benefits.push(`$${(plan.accidentalDeathBenefit / 1000).toFixed(0)}k accidental death benefit`);
                    }
                    if (plan.disabilityBenefit > 0) {
                      benefits.push(`$${(plan.disabilityBenefit / 1000).toFixed(0)}k disability coverage`);
                    }
                    if (plan.criticalIllnessBenefit > 0) {
                      benefits.push(`$${(plan.criticalIllnessBenefit / 1000).toFixed(0)}k critical illness`);
                    }
                    if (plan.includesMaternityBenefit) {
                      benefits.push('Maternity benefits included');
                    }
                    if (plan.includesRiderOptions) {
                      benefits.push('Additional riders available');
                    }

                    return (
                      <Card
                        key={plan.id}
                        className={`hover:shadow-xl transition-all ${plan.isPopular ? `border-2 ${colorTheme.border} shadow-lg` : ''
                          }`}
                      >
                        <CardHeader>
                          {plan.isPopular && (
                            <Badge className="w-fit mb-2 bg-gradient-to-r from-purple-600 to-blue-600">
                              <Star className="size-3 mr-1" /> Most Popular
                            </Badge>
                          )}
                          {plan.isFeatured && !plan.isPopular && (
                            <Badge className="w-fit mb-2" variant="secondary">
                              <Zap className="size-3 mr-1" /> Featured
                            </Badge>
                          )}
                          <div className="flex items-start gap-3 mb-2">
                            <div className={`${colorTheme.icon} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <Shield className="size-6" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg leading-tight">{plan.planName}</CardTitle>
                              <CardDescription className="text-xs mt-1 line-clamp-2">
                                {plan.description || `${plan.planCode} - ${plan.termYears} year term`}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {/* Price Display */}
                            <div className={`text-center py-6 ${colorTheme.bg} rounded-lg border ${colorTheme.border}`}>
                              {isCalculating ? (
                                <>
                                  <div className="animate-pulse">
                                    <div className="h-8 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className={`text-4xl font-bold ${colorTheme.text} mb-1`}>
                                    ${Math.round(calculatedPrice).toLocaleString()}
                                  </div>
                                  <div className="text-sm text-gray-600 font-medium">
                                    per {selectedFrequency === 'LumpSum' ? 'policy' : selectedFrequency.toLowerCase()}
                                  </div>
                                  {selectedFrequency === 'LumpSum' && (
                                    <Badge className="mt-2 bg-green-500">
                                      <Gift className="size-3 mr-1" /> Best Value
                                    </Badge>
                                  )}
                                </>
                              )}
                            </div>

                            {/* Key Benefits */}
                            <div>
                              <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Award className="size-4" />
                                Key Benefits
                              </p>
                              <ul className="space-y-2">
                                {benefits.slice(0, 4).map((benefit, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm">
                                    <CheckCircle className={`size-4 ${colorTheme.text} flex-shrink-0 mt-0.5`} />
                                    <span className="text-gray-700">{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Additional Info */}
                            <div className="pt-3 border-t space-y-2">
                              {plan.requiresMedicalExam && (
                                <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded">
                                  <AlertCircle className="size-4" />
                                  <span>Medical examination required</span>
                                </div>
                              )}
                              <div className="text-xs text-gray-500">
                                <strong>Eligibility:</strong> Age {plan.minAge}-{plan.maxAge} years
                              </div>
                            </div>

                            {/* CTA Button */}
                            <Button
                              className="w-full group"
                              size="lg"
                              variant={plan.isPopular ? "default" : "outline"}
                              disabled={isCalculating}
                              onClick={() => {
                                const paramsToSave = {
                                  productId: product.id,
                                  planId: plan.id,
                                  type: product.productType,
                                  applicationType: product.productType === 'Medical' ? 'HealthInsurance' : 'LifeInsurance',
                                  paymentFrequency: selectedFrequency,
                                  premiumAmount: Math.round(calculatedPrice || 0),
                                  timestamp: Date.now(),
                                  source: 'product-detail'
                                };
                                console.log('💾 ProductDetail: Saving quote to localStorage:', paramsToSave);
                                localStorage.setItem('calculatorParams', JSON.stringify(paramsToSave));

                                const route = getApplicationRoute(product.productType, {
                                  productId: product.id,
                                  planId: plan.id,
                                  frequency: selectedFrequency,
                                  premium: Math.round(calculatedPrice || 0)
                                });
                                console.log('🔗 Get Quote clicked for plan:', plan.planName, 'Route:', route);
                                navigate(route);
                              }}
                            >
                              Apply Now
                              <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Plan Comparison Note */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <Info className="size-6 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Need Help Choosing?</h3>
                  <p className="text-sm text-gray-600 mb-4 max-w-2xl mx-auto">
                    Prices shown are estimates based on standard rates (age 30, good health, low-risk occupation).
                    Your actual premium may vary based on age, health status, occupation, and other factors.
                  </p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/calculator">
                        <Calculator className="size-4 mr-2" />
                        Calculate My Premium
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="size-4 mr-2" />
                      Speak to Advisor
                    </Button>
                  </div>
                </div>
              </section>
            )}

            {/* Coverage Details */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Coverage Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* What's Covered */}
                <Card className="border-green-200 bg-green-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="size-5" />
                      What's Covered
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {getCoveredItems().map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* What's Not Covered */}
                <Card className="border-red-200 bg-red-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <XCircle className="size-5" />
                      What's Not Covered
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {getExclusions().map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <XCircle className="size-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Policy Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Policy Terms & Conditions</h2>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="size-5 text-gray-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Policy Term</h4>
                      <p className="text-sm text-gray-600">
                        Flexible policy terms ranging from {product.minTermYears} to {product.maxTermYears} years based on your needs.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="size-5 text-gray-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Coverage Amount</h4>
                      <p className="text-sm text-gray-600">
                        Choose coverage from ${product.minCoverageAmount?.toLocaleString()} to ${product.maxCoverageAmount?.toLocaleString()} based on your requirements.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="size-5 text-gray-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Premium Payment</h4>
                      <p className="text-sm text-gray-600">
                        {product.productType === 'Life' ? 'Monthly' : 'Annual'} premium payment options available. Premiums calculated based on age, coverage, and term selected.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Info className="size-5 text-gray-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Free Look Period</h4>
                      <p className="text-sm text-gray-600">
                        30-day free look period. You can cancel the policy within 30 days if not satisfied, and receive a full refund.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Additional Benefits */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Benefits</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {getAdditionalBenefits().map((benefit, index) => (
                  <Card key={index} className={`${colors.bg} border ${colors.border}`}>
                    <CardContent className="p-5">
                      <div className="flex gap-4">
                        <div className={`${colors.icon} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <benefit.icon className="size-6" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{benefit.title}</h4>
                          <p className="text-sm text-gray-600">{benefit.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Claims Process */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How to File a Claim</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-6">
                    {getClaimsProcess().map((step, index) => (
                      <div key={index} className="text-center">
                        <div className={`${colors.icon} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold`}>
                          {step.step}
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                        <p className="text-sm text-gray-600">{step.desc}</p>
                        {index < getClaimsProcess().length - 1 && (
                          <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200" style={{ transform: 'translateX(-50%)' }} />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Eligibility */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Eligibility Criteria</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="size-5 text-gray-600" />
                        Age Requirements
                      </h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>• Minimum Age: {eligibility.minAge} years</p>
                        {eligibility.maxAge && <p>• Maximum Age: {eligibility.maxAge} years</p>}
                        {!eligibility.maxAge && <p>• Maximum Age: No upper limit</p>}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="size-5 text-gray-600" />
                        Required Documents
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        {eligibility.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Tax Benefits */}
            {(product.productType === 'Life' || product.productType === 'Medical' || product.productType === 'Health') && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tax Benefits</h2>
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <DollarSign className="size-12 text-amber-600 flex-shrink-0" />
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 text-lg">
                          Save on Taxes with {product.productType} Insurance
                        </h4>
                        {product.productType === 'Life' && (
                          <>
                            <p className="text-sm text-gray-700">
                              <strong>Section 80C:</strong> Deduction up to ₹1.5 lakh on premium paid annually
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Section 10(10D):</strong> Maturity proceeds and death benefits are tax-free
                            </p>
                          </>
                        )}
                        {(product.productType === 'Medical' || product.productType === 'Health') && (
                          <>
                            <p className="text-sm text-gray-700">
                              <strong>Section 80D:</strong> Deduction up to ₹25,000 for self, spouse & children
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Additional ₹25,000:</strong> For parents below 60 years (₹50,000 if above 60)
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>Preventive Health Check-up:</strong> Additional ₹5,000 deduction
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* FAQs */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  {
                    q: `What is the waiting period for this ${product?.productType?.toLowerCase() || 'insurance'} insurance?`,
                    a: product?.productType === 'Life'
                      ? 'Life insurance typically has no waiting period for accidental death. For natural death, most policies have a waiting period of 30-90 days. Suicide is excluded in the first year.'
                      : (product.productType === 'Medical' || product.productType === 'Health')
                        ? 'Initial waiting period of 30 days for illnesses (not applicable for accidents). Pre-existing diseases have 2-4 years waiting period. Specific diseases like hernia, cataract may have 1-2 years waiting.'
                        : 'Most policies become effective immediately after payment. However, check your policy document for specific waiting periods if any.'
                  },
                  {
                    q: 'Can I increase my coverage amount later?',
                    a: 'Yes, many policies allow you to increase coverage during policy renewal or on specific life events like marriage, childbirth, etc. Additional underwriting may be required.'
                  },
                  {
                    q: 'What happens if I miss a premium payment?',
                    a: 'Most policies offer a grace period of 15-30 days. If payment is not made within grace period, policy may lapse. You can revive lapsed policies within a specified period by paying pending premiums with interest.'
                  },
                  {
                    q: 'Is medical examination required?',
                    a: product.productType === 'Life' || product.productType === 'Medical' || product.productType === 'Health'
                      ? 'Medical examination is required for higher sum insured (typically above ₹50 lakhs) or if you are above certain age. Basic policies may be issued based on declaration.'
                      : 'Generally, no medical examination is required for property insurance. However, property inspection may be conducted.'
                  }
                ].map((faq, index) => (
                  <Card key={index}>
                    <CardContent className="p-5">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                        <MessageCircle className="size-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{faq.q}</span>
                      </h4>
                      <p className="text-sm text-gray-600 ml-7">{faq.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Premium Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="size-5" />
                  Calculate Premium
                </CardTitle>
                <CardDescription>
                  Get an instant estimate for this plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MiniCalculator product={product} productType={product.productType} />
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card className={`${colors.bg} border-2 ${colors.border}`}>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
                <CardDescription>
                  Our experts are here to assist you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="size-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium">Call Us</p>
                    <p className="text-sm text-gray-600">1-800-INSURANCE</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="size-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium">Email Us</p>
                    <p className="text-sm text-gray-600">support@insurance.com</p>
                  </div>
                </div>
                <Button className="w-full mt-4">
                  Request Callback
                </Button>
              </CardContent>
            </Card>

            {/* Download Brochure */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <FileText className="size-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Product Brochure</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Download detailed information about this product
                  </p>
                  <Button variant="outline" className="w-full">
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProducts.map((relProduct) => (
                <Card key={relProduct.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Badge variant="secondary" className="w-fit mb-2">
                      {relProduct.productType} Insurance
                    </Badge>
                    <CardTitle className="text-lg">{relProduct.productName}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {relProduct.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full" asChild>
                        <Link to={`/product/${relProduct.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Bottom CTA */}
      <section className={`bg-gradient-to-r ${colors.gradient} text-white py-12 mt-12`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Protect what matters most. Apply for {product.productName} today and secure your future.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to={getApplicationRoute(product.productType, {
                productId: product.id
              })}>
                Apply Now
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900"
            >
              Compare Plans
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}


