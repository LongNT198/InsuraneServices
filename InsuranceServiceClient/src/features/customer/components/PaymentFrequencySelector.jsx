import { useState, useEffect } from 'react';
import { Check, TrendingDown, Sparkles } from 'lucide-react';

/**
 * Payment Frequency Selector Component
 * Displays all available payment options with pricing details
 */
const PaymentFrequencySelector = ({ 
  productId, 
  termYears, 
  coverageAmount,
  onSelect 
}) => {
  const [quotes, setQuotes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState(null);

  useEffect(() => {
    if (productId && termYears && coverageAmount) {
      fetchQuotes();
    }
  }, [productId, termYears, coverageAmount]);

  const fetchQuotes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/premiumquote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          termYears,
          coverageAmount
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quotes');
      }

      const data = await response.json();
      setQuotes(data);
      
      // Auto-select recommended option
      const recommended = data.paymentOptions.find(opt => opt.isRecommended);
      if (recommended) {
        setSelectedFrequency(recommended.paymentFrequency);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (option) => {
    setSelectedFrequency(option.paymentFrequency);
    if (onSelect) {
      onSelect(option);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getFrequencyColor = (frequency) => {
    switch (frequency) {
      case 'LumpSum':
        return 'from-green-500 to-emerald-600';
      case 'Annual':
        return 'from-blue-500 to-indigo-600';
      case 'SemiAnnual':
        return 'from-purple-500 to-violet-600';
      case 'Quarterly':
        return 'from-orange-500 to-amber-600';
      case 'Monthly':
        return 'from-pink-500 to-rose-600';
      default:
        return 'from-gray-500 to-slate-600';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p className="font-medium">Lỗi khi tải dữ liệu</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (!quotes) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Chọn Phương Thức Thanh Toán
        </h2>
        <p className="text-gray-600">
          Lựa chọn phương thức thanh toán phù hợp với khả năng tài chính của bạn
        </p>
      </div>

      {/* Payment Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quotes.paymentOptions.map((option) => (
          <div
            key={option.paymentFrequency}
            onClick={() => handleSelect(option)}
            className={`
              relative cursor-pointer rounded-xl border-2 transition-all duration-300
              ${selectedFrequency === option.paymentFrequency
                ? 'border-blue-500 shadow-lg scale-105'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
              }
              ${option.isRecommended ? 'ring-2 ring-yellow-400' : ''}
            `}
          >
            {/* Recommended Badge */}
            {option.isRecommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-3 h-3" />
                  KHUYẾN NGHỊ
                </div>
              </div>
            )}

            {/* Selected Indicator */}
            {selectedFrequency === option.paymentFrequency && (
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-blue-500 rounded-full p-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            )}

            <div className="p-6">
              {/* Frequency Name */}
              <div className={`
                bg-gradient-to-r ${getFrequencyColor(option.paymentFrequency)}
                text-white px-4 py-2 rounded-lg mb-4 text-center
              `}>
                <h3 className="font-bold text-lg">{option.displayName}</h3>
              </div>

              {/* Payment Amount */}
              <div className="text-center mb-4">
                <p className="text-gray-600 text-sm mb-1">
                  {option.isLumpSum ? 'Thanh toán một lần' : 'Mỗi kỳ thanh toán'}
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(option.paymentPerPeriod)}
                </p>
                {!option.isLumpSum && (
                  <p className="text-gray-500 text-sm mt-1">
                    × {option.numberOfPayments} lần
                  </p>
                )}
              </div>

              {/* Adjustment Badge */}
              {option.adjustmentPercentage !== 0 && (
                <div className={`
                  text-center mb-4 px-3 py-2 rounded-lg
                  ${option.adjustmentPercentage < 0 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-orange-50 text-orange-700'
                  }
                `}>
                  <p className="text-sm font-medium">
                    {option.adjustmentPercentage < 0 ? '🎉 Chiết khấu ' : '⚠️ Phụ thu '}
                    {Math.abs(option.adjustmentPercentage).toFixed(1)}%
                  </p>
                </div>
              )}

              {/* Savings */}
              {option.savingsVsMonthly > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-center gap-2 text-green-700">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Tiết kiệm {formatCurrency(option.savingsVsMonthly)}
                    </span>
                  </div>
                  <p className="text-xs text-green-600 text-center mt-1">
                    ({option.savingsPercentageVsMonthly.toFixed(1)}% so với trả hàng tháng)
                  </p>
                </div>
              )}

              {/* Total Amount */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Tổng phí bảo hiểm:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(option.totalPremium)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Phí phát sinh:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(option.oneTimeFees)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-sm font-bold text-gray-900">TỔNG CỘNG:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(option.grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="bg-gray-50 rounded-xl p-6 mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          📊 So Sánh Chi Tiết
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Phương thức
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  Mỗi kỳ
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Số lần
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  Điều chỉnh
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  Tổng cộng
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  Tiết kiệm
                </th>
              </tr>
            </thead>
            <tbody>
              {quotes.paymentOptions.map((option, index) => (
                <tr 
                  key={option.paymentFrequency}
                  className={`
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    ${option.isRecommended ? 'font-semibold' : ''}
                    ${selectedFrequency === option.paymentFrequency ? 'bg-blue-50' : ''}
                  `}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {option.displayName}
                    {option.isRecommended && (
                      <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                        Khuyến nghị
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {formatCurrency(option.paymentPerPeriod)}
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-900">
                    {option.numberOfPayments}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-medium ${
                    option.adjustmentPercentage < 0 ? 'text-green-600' : 
                    option.adjustmentPercentage > 0 ? 'text-orange-600' : 'text-gray-600'
                  }`}>
                    {option.adjustmentPercentage > 0 ? '+' : ''}
                    {option.adjustmentPercentage.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                    {formatCurrency(option.grandTotal)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">
                    {option.savingsVsMonthly > 0 ? (
                      <>
                        {formatCurrency(option.savingsVsMonthly)}
                        <span className="text-xs ml-1">
                          ({option.savingsPercentageVsMonthly.toFixed(1)}%)
                        </span>
                      </>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Lưu ý:</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Thanh toán một lần (Lump Sum) giúp bạn tiết kiệm nhiều nhất</li>
          <li>Thanh toán hàng tháng linh hoạt nhưng có phụ thu cao hơn</li>
          <li>Tất cả phí đã bao gồm VAT và phí quản lý</li>
          <li>Bạn có thể thay đổi phương thức thanh toán trước khi xác nhận</li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentFrequencySelector;
