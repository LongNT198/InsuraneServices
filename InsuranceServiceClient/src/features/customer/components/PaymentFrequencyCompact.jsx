import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

/**
 * Compact Payment Frequency Selector - For integration in multi-step forms
 * Simplified version without comparison table
 */
const PaymentFrequencyCompact = ({
  productId,
  termYears,
  coverageAmount,
  value,
  onChange
}) => {
  const [quotes, setQuotes] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchQuotes = async () => {
    setLoading(true);

    // Validate inputs before sending
    if (!productId || !termYears || !coverageAmount) {
      console.error('Missing required fields:', { productId, termYears, coverageAmount });
      setQuotes({ paymentOptions: [] });
      setLoading(false);
      return;
    }

    // Ensure values are within valid ranges (backend business rules)
    const validTermYears = Math.max(1, Math.min(100, parseInt(termYears) || 10));
    // Backend requires: Coverage amount must be between $50,000 and $10,000,000
    const validCoverageAmount = Math.max(50000, Math.min(10000000, parseFloat(coverageAmount) || 50000));

    const requestData = {
      ProductId: parseInt(productId) || 1,
      TermYears: validTermYears,
      CoverageAmount: validCoverageAmount
    };

    console.log('Fetching quotes with:', requestData);
    console.log('Original values:', {
      productId: { value: productId, type: typeof productId },
      termYears: { value: termYears, type: typeof termYears },
      coverageAmount: { value: coverageAmount, type: typeof coverageAmount }
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://localhost:7001'}/api/premiumquote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        console.error('Validation Errors:', errorData.errors);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Quotes received:', data);
      setQuotes(data);
    } catch (err) {
      console.error('Failed to fetch quotes:', err);
      setQuotes({ paymentOptions: [] }); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId && termYears && coverageAmount) {
      fetchQuotes();
    }
  }, [productId, termYears, coverageAmount]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
        <p className="text-sm text-gray-500 mt-3">Đang tải các tùy chọn thanh toán...</p>
      </div>
    );
  }

  if (!quotes || !quotes.paymentOptions || quotes.paymentOptions.length === 0) {
    return (
      <div className="text-center py-6 px-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">Không có tùy chọn thanh toán. Vui lòng kiểm tra lại thông tin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {quotes.paymentOptions.map((option) => (
        <div
          key={option.paymentFrequency}
          onClick={() => onChange(option)}
          className={`
            relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200
            ${value?.paymentFrequency === option.paymentFrequency
              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md scale-[1.02]'
              : 'border-gray-200 hover:border-blue-300 hover:shadow-sm hover:bg-gray-50'
            }
          `}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-gray-900 text-base">
                  {option.displayName}
                </h4>
                {option.isRecommended && (
                  <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2.5 py-0.5 rounded-full font-medium shadow-sm">
                    ⭐ Khuyến nghị
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  ${option.paymentPerPeriod.toLocaleString()}
                </span>
                {!option.isLumpSum && (
                  <span className="text-sm text-gray-500 font-medium">
                    × {option.numberOfPayments} lần
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="space-y-1">
                {option.isLumpSum ? (
                  <p className="text-sm text-blue-600 font-medium">
                    ✓ Thanh toán 1 lần duy nhất
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    Tổng: ${option.grandTotal.toLocaleString()}
                  </p>
                )}

                {option.savingsVsMonthly > 0 && (
                  <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                    <span>💰</span>
                    <span>Tiết kiệm ${option.savingsVsMonthly.toLocaleString()} ({option.savingsPercentageVsMonthly.toFixed(1)}%)</span>
                  </div>
                )}

                {option.frequencyAdjustment > 0 && !option.savingsVsMonthly && (
                  <p className="text-xs text-amber-600">
                    +${option.frequencyAdjustment.toLocaleString()} phí chia nhỏ
                  </p>
                )}
              </div>
            </div>

            {/* Checkmark */}
            {value?.paymentFrequency === option.paymentFrequency ? (
              <div className="flex-shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-1.5 shadow-md">
                <Check className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
            ) : (
              <div className="flex-shrink-0 w-8 h-8 border-2 border-gray-300 rounded-full"></div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentFrequencyCompact;
