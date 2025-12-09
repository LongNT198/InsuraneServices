import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Calculator, Info } from 'lucide-react';

export function PremiumCalculator({ productType, products }) {
  const [formData, setFormData] = useState({
    age: 30,
    coverage: 500000,
    term: 20,
    productId: products[0]?.id || ''
  });
  const [premium, setPremium] = useState(null);

  const handleCalculate = () => {
    const product = products.find(p => p.id === parseInt(formData.productId));
    if (!product) return;

    let calculatedPremium;
    
    if (productType === 'Life') {
      // Life: Monthly premium = (Coverage × BaseRate × Term) / 12
      const ageFactor = formData.age < 30 ? 0.9 : formData.age < 40 ? 1.0 : formData.age < 50 ? 1.2 : 1.5;
      calculatedPremium = (formData.coverage * product.baseRate * formData.term * ageFactor) / 12;
    } else if (productType === 'Medical') {
      // Medical: Annual premium = Coverage × BaseRate × Age factor
      const ageFactor = formData.age < 35 ? 0.8 : formData.age < 50 ? 1.0 : 1.3;
      calculatedPremium = formData.coverage * product.baseRate * ageFactor;
    } else if (productType === 'Motor') {
      // Motor: Annual premium = Vehicle Value × BaseRate
      calculatedPremium = formData.coverage * product.baseRate;
    } else if (productType === 'Home') {
      // Home: Annual premium = Property Value × BaseRate
      calculatedPremium = formData.coverage * product.baseRate;
    }

    setPremium(Math.round(calculatedPremium));
  };

  const getCoverageLabel = () => {
    switch(productType) {
      case 'Life': return 'Coverage Amount';
      case 'Medical': return 'Sum Insured';
      case 'Motor': return 'Vehicle Value';
      case 'Home': return 'Property Value';
      default: return 'Coverage Amount';
    }
  };

  const showTerm = productType === 'Life' || productType === 'Medical';
  const selectedProduct = products.find(p => p.id === parseInt(formData.productId));

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Calculator className="size-6 text-blue-600" />
          <div>
            <CardTitle>Premium Calculator</CardTitle>
            <CardDescription>Calculate your estimated premium instantly</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Plan
              </label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.productName}
                  </option>
                ))}
              </select>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Age
              </label>
              <input
                type="number"
                min="18"
                max="65"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Coverage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getCoverageLabel()}
              </label>
              <input
                type="number"
                min={selectedProduct?.minCoverageAmount || 10000}
                max={selectedProduct?.maxCoverageAmount || 5000000}
                step="10000"
                value={formData.coverage}
                onChange={(e) => setFormData({ ...formData, coverage: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Range: ${selectedProduct?.minCoverageAmount?.toLocaleString()} - ${selectedProduct?.maxCoverageAmount?.toLocaleString()}
              </p>
            </div>

            {/* Term (for Life and Medical only) */}
            {showTerm && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Policy Term (Years)
                </label>
                <input
                  type="number"
                  min={selectedProduct?.minTermYears || 1}
                  max={selectedProduct?.maxTermYears || 30}
                  value={formData.term}
                  onChange={(e) => setFormData({ ...formData, term: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: {selectedProduct?.minTermYears} - {selectedProduct?.maxTermYears} years
                </p>
              </div>
            )}

            <Button onClick={handleCalculate} className="w-full">
              Calculate Premium
            </Button>
          </div>

          {/* Results */}
          <div className="flex items-center justify-center">
            {premium !== null ? (
              <div className="text-center p-6 bg-white rounded-xl shadow-lg border-2 border-green-200 w-full">
                <p className="text-sm text-gray-600 mb-2">Estimated Premium</p>
                <p className="text-4xl font-bold text-green-600 mb-2">
                  ${premium.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  {productType === 'Life' ? 'per month' : 'per year'}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-2 text-xs text-gray-600 text-left">
                    <Info className="size-4 flex-shrink-0 mt-0.5" />
                    <p>
                      This is an estimated premium. Actual premium may vary based on medical checkup, 
                      lifestyle factors, and underwriting assessment.
                    </p>
                  </div>
                </div>
                <a 
                  href={
                    productType === 'Medical' || productType === 'Health'
                      ? `/apply-health?productId=${formData.productId}`
                      : productType === 'Life'
                      ? `/apply-life?productId=${formData.productId}`
                      : productType === 'Motor'
                      ? `/apply-motor?productId=${formData.productId}`
                      : productType === 'Home'
                      ? `/apply-home?productId=${formData.productId}`
                      : `/apply-life?productId=${formData.productId}`
                  }
                  className="inline-flex items-center justify-center w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Proceed to Apply
                </a>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <Calculator className="size-16 mx-auto mb-4 opacity-50" />
                <p>Enter your details and click Calculate to see your premium</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

