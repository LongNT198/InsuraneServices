import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ComparisonTable({ products, productType }) {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  const toggleProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      if (selectedProducts.length < 3) {
        setSelectedProducts([...selectedProducts, productId]);
      }
    }
  };

  const comparedProducts = products.filter(p => selectedProducts.includes(p.id));

  const calculatePremium = (product) => {
    if (productType === 'Life') {
      return Math.round((product.minCoverageAmount * product.baseRate * product.minTermYears) / 12);
    }
    return Math.round(product.minCoverageAmount * product.baseRate);
  };

  const getComparisonRows = () => {
    const rows = [
      {
        label: 'Product Name',
        getValue: (p) => p.productName,
        isHighlight: true
      },
      {
        label: 'Product Type',
        getValue: (p) => `${p.productType} Insurance`
      },
      {
        label: productType === 'Life' ? 'Monthly Premium (est.)' : 'Annual Premium (est.)',
        getValue: (p) => `$${calculatePremium(p).toLocaleString()}`,
        isPrice: true
      }
    ];

    return rows;
  };

  if (!showComparison || comparedProducts.length === 0) {
    return (
      <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Compare Products</h3>
            <p className="text-sm text-gray-600 mt-1">
              Select 2-3 products to compare side by side
            </p>
          </div>
          {selectedProducts.length > 0 && (
            <Badge variant="secondary">
              {selectedProducts.length} selected
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {products.map((product) => {
            const isSelected = selectedProducts.includes(product.id);
            return (
              <button
                key={product.id}
                onClick={() => toggleProduct(product.id)}
                disabled={!isSelected && selectedProducts.length >= 3}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-100'
                    : selectedProducts.length >= 3
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                    : 'border-gray-200 hover:border-blue-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{product.productName}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      ${calculatePremium(product).toLocaleString()}/{productType === 'Life' ? 'mo' : 'yr'}
                    </p>
                  </div>
                  {isSelected ? (
                    <CheckCircle className="size-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <div className="size-5 border-2 border-gray-300 rounded-full flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {selectedProducts.length >= 2 && (
          <Button onClick={() => setShowComparison(true)} className="w-full">
            Compare Selected Products
          </Button>
        )}
        {selectedProducts.length === 1 && (
          <p className="text-sm text-gray-600 text-center">
            Select at least one more product to compare
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Product Comparison</CardTitle>
            <Button variant="outline" onClick={() => setShowComparison(false)} size="sm">
              Edit Selection
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold bg-gray-50">Features</th>
                  {comparedProducts.map((product) => (
                    <th key={product.id} className="p-4 text-center bg-gray-50">
                      <div className="font-semibold text-gray-900">{product.productName}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getComparisonRows().map((row, idx) => (
                  <tr key={idx} className={`border-b ${row.isHighlight ? 'bg-blue-50' : ''}`}>
                    <td className="p-4 font-medium text-gray-700">{row.label}</td>
                    {comparedProducts.map((product) => (
                      <td
                        key={product.id}
                        className={`p-4 text-center ${
                          row.isPrice ? 'font-bold text-green-600' : 'text-gray-900'
                        }`}
                      >
                        {row.getValue(product)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="p-4"></td>
                  {comparedProducts.map((product) => (
                    <td key={product.id} className="p-4">
                      <Button className="w-full" asChild>
                        <Link to={`/apply-${productType?.toLowerCase()}?productId=${product.id}`}>
                          Apply Now <ArrowRight className="size-4 ml-2" />
                        </Link>
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> Premiums shown are estimates based on minimum coverage. 
              Actual premiums may vary based on your age, health, location, and other factors.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

